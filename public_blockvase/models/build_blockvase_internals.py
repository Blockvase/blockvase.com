"""Build detailed Pi + HAT + NVMe stack and USB-C plug, then export GLB."""
import bpy
import bmesh
import math
from mathutils import Vector, Matrix
from bpy_extras.image_utils import load_image

MODELS = "/home/ubuntu/happyrobotshop/Server/Happy-Robot-Shop-Website-UI/public_blockvase/models"
OUT_GLB = f"{MODELS}/blockvase.glb"
POSTER = f"{MODELS}/lcd-mempool-poster.jpg"


def mat(name, color, metallic=0.0, roughness=0.5, emission=None, emission_strength=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission is not None:
        bsdf.inputs["Emission Color"].default_value = (*emission, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    if "Sheen Weight" in bsdf.inputs:
        bsdf.inputs["Sheen Weight"].default_value = 0.0
    return m


def link_obj(ob, material=None, collection=None):
    if material is not None:
        ob.data.materials.clear()
        ob.data.materials.append(material)
    if collection is None:
        collection = bpy.context.collection
    if ob.name not in collection.objects:
        collection.objects.link(ob)
    return ob


def add_box(name, size, location, rotation=(0, 0, 0), material=None):
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bm.to_mesh(mesh)
    bm.free()
    ob = bpy.data.objects.new(name, mesh)
    ob.location = location
    ob.rotation_euler = rotation
    ob.scale = size
    bpy.context.collection.objects.link(ob)
    # Deselect others first — apply operates on the whole selection, and the
    # source blend often loads with lcd/screen selected (~-89.3° Z).
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = ob
    ob.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    ob.select_set(False)
    if material:
        ob.data.materials.clear()
        ob.data.materials.append(material)
    return ob


def add_cylinder(name, radius, depth, location, rotation=(0, 0, 0), material=None, vertices=24):
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=vertices, radius1=radius, radius2=radius, depth=depth)
    bm.to_mesh(mesh)
    bm.free()
    ob = bpy.data.objects.new(name, mesh)
    ob.location = location
    ob.rotation_euler = rotation
    bpy.context.collection.objects.link(ob)
    if material:
        ob.data.materials.clear()
        ob.data.materials.append(material)
    return ob


def add_stadium(name, length, width, height, location, rotation=(0, 0, 0), material=None, segments=16):
    """Capsule/stadium prism: USB-C style rounded rectangle extruded on local Y."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    # Profile in XZ: stadium of size length(X) x height(Z), extruded along Y by width
    hx = length * 0.5
    hz = height * 0.5
    r = hz  # end radius = half height
    straight = max(0.01, length - height)

    verts = []
    # left semicircle + right semicircle around a center span on X
    cx_l = -straight * 0.5
    cx_r = straight * 0.5
    for i in range(segments + 1):
        ang = math.pi / 2 + (math.pi * i / segments)  # top to bottom on left
        verts.append((cx_l + r * math.cos(ang), 0.0, r * math.sin(ang)))
    for i in range(segments + 1):
        ang = -math.pi / 2 + (math.pi * i / segments)  # bottom to top on right
        verts.append((cx_r + r * math.cos(ang), 0.0, r * math.sin(ang)))

    # Extrude profile along Y
    bm_verts_back = [bm.verts.new((x, -width * 0.5, z)) for x, _, z in verts]
    bm_verts_front = [bm.verts.new((x, width * 0.5, z)) for x, _, z in verts]
    bm.verts.ensure_lookup_table()
    n = len(verts)
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((bm_verts_back[i], bm_verts_back[j], bm_verts_front[j], bm_verts_front[i]))
    bm.faces.new(list(reversed(bm_verts_back)))
    bm.faces.new(bm_verts_front)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    ob = bpy.data.objects.new(name, mesh)
    ob.location = location
    ob.rotation_euler = rotation
    bpy.context.collection.objects.link(ob)
    if material:
        ob.data.materials.clear()
        ob.data.materials.append(material)
    return ob


def add_pin_grid(name_prefix, origin, rows, cols, pitch, height, radius, material):
    objs = []
    for r in range(rows):
        for c in range(cols):
            x = origin[0] + (c - (cols - 1) / 2) * pitch
            y = origin[1] + (r - (rows - 1) / 2) * pitch
            z = origin[2] + height * 0.5
            ob = add_cylinder(
                f"{name_prefix}_{r}_{c}",
                radius=radius,
                depth=height,
                location=(x, y, z),
                material=material,
                vertices=8,
            )
            objs.append(ob)
    return objs


# -----------------------------------------------------------------------------
# Materials
# -----------------------------------------------------------------------------
mat_pcb = mat("PiPCB", (0.07, 0.36, 0.15), metallic=0.04, roughness=0.55)
mat_hat = mat("HatPCB", (0.05, 0.28, 0.12), metallic=0.04, roughness=0.58)
mat_silk = mat("PiSilk", (0.86, 0.86, 0.82), metallic=0.0, roughness=0.7)
mat_gold = mat("PiGold", (0.83, 0.68, 0.22), metallic=1.0, roughness=0.25)
mat_metal = mat("PiMetal", (0.58, 0.58, 0.60), metallic=1.0, roughness=0.3)
mat_shield = mat("PiShield", (0.45, 0.45, 0.48), metallic=1.0, roughness=0.35)
mat_black = mat("PiBlack", (0.02, 0.02, 0.02), metallic=0.12, roughness=0.42)
mat_dark = mat("PiDarkPlastic", (0.05, 0.05, 0.055), metallic=0.05, roughness=0.5)
mat_chip = mat("PiChip", (0.08, 0.08, 0.09), metallic=0.2, roughness=0.4)
mat_silver = mat("PiSilver", (0.72, 0.72, 0.74), metallic=1.0, roughness=0.28)
mat_nvme = mat("NvmeStick", (0.03, 0.03, 0.035), metallic=0.15, roughness=0.45)
mat_nvme_label = mat("NvmeLabel", (0.75, 0.12, 0.08), metallic=0.0, roughness=0.55)
mat_cable = mat("UsbCable", (0.015, 0.015, 0.015), metallic=0.0, roughness=0.5)
mat_strain = mat("UsbStrain", (0.025, 0.025, 0.028), metallic=0.02, roughness=0.58)
mat_led = mat("PiLED", (0.05, 0.85, 0.18), metallic=0.0, roughness=0.35, emission=(0.15, 1.0, 0.25), emission_strength=4.0)
mat_body = mat("BodyWhite", (0.92, 0.92, 0.90), metallic=0.0, roughness=0.72)
mat_pcie = mat("PcieFlex", (0.55, 0.45, 0.12), metallic=0.05, roughness=0.55)

body = bpy.data.objects["body"]
if not body.data.materials:
    body.data.materials.append(mat_body)

# -----------------------------------------------------------------------------
# Port / board placement (Blender Z-up, port on +Y)
# -----------------------------------------------------------------------------
PORT_X = 1.0
PORT_Y_FACE = 47.585
# Inner face of the rectangular port groove — PCB edges butt here
PORT_GROOVE_Y = 44.285

# Pi board sits horizontally; SD edge toward +Y port, seated in the groove
PI_W = 56.0   # X
PI_D = 85.0   # Y
PI_T = 1.6    # Z thickness
SD_EDGE_Y = PORT_GROOVE_Y - 0.05  # flush against inner groove wall
PI_Y = SD_EDGE_Y - PI_D * 0.5

# Gap for NVMe + clearance between Pi and HAT.
STACK_GAP = 8.5
PI_Z = -73.6
HAT_Z = PI_Z + PI_T * 0.5 + STACK_GAP + 0.8
SD_Z = PI_Z + 1.0
# Outer USB-C hole on the face: x≈[-3.2,5.2], z≈[-74.1,-71.6], center z≈-72.85
USB_Z = -72.85
USB_HOLE_H = 2.35  # tip height must fit the ~2.56 opening

# -----------------------------------------------------------------------------
# Raspberry Pi PCB + components
# -----------------------------------------------------------------------------
pi = add_box("raspberry_pi_pcb", (PI_W, PI_D, PI_T), location=(PORT_X, PI_Y, PI_Z), material=mat_pcb)

# SD edge seated in the groove — housing can peek into the outer pocket,
# but the PCB itself is flush with PORT_GROOVE_Y
sd_y = PI_Y + PI_D * 0.5  # ~= SD_EDGE_Y
add_box("sd_slot_housing", (12.0, 3.2, 2.0), location=(PORT_X, sd_y + 1.0, PI_Z + 0.9), material=mat_metal)
add_box("sd_card", (10.5, 1.4, 0.9), location=(PORT_X, sd_y + 1.8, PI_Z + 0.9), material=mat_black)
add_box("sd_contacts", (9.5, 0.4, 0.35), location=(PORT_X, sd_y + 0.6, PI_Z + 0.55), material=mat_gold)
add_box("pi_activity_led", (1.5, 1.1, 0.7), location=(PORT_X - 8.0, sd_y - 1.5, PI_Z + 2.0), material=mat_led)

# Extra components near the SD/+Y edge so the port view isn't an empty green slab
add_box("pi_edge_ic_1", (5.5, 5.0, 1.1), location=(PORT_X + 10.0, sd_y - 6.0, PI_Z + 1.4), material=mat_chip)
add_box("pi_edge_ic_2", (4.0, 4.0, 1.0), location=(PORT_X - 14.0, sd_y - 7.0, PI_Z + 1.35), material=mat_chip)
add_box("pi_edge_shield", (9.0, 7.0, 1.6), location=(PORT_X + 2.0, sd_y - 10.0, PI_Z + 1.7), material=mat_shield)
add_box("pi_edge_conn", (3.5, 10.0, 2.0), location=(PORT_X + 18.0, sd_y - 8.0, PI_Z + 1.6), material=mat_black)
for i, dx in enumerate([-18, -10, 8, 14]):
    add_cylinder(f"pi_edge_cap_{i}", radius=0.9, depth=1.6, location=(PORT_X + dx, sd_y - 4.5, PI_Z + 1.5), material=mat_silver, vertices=10)

# SoC shield (center-ish)
add_box("pi_soc_shield", (16.0, 16.0, 2.2), location=(PORT_X - 4.0, PI_Y + 8.0, PI_Z + 1.9), material=mat_shield)
# RAM package
add_box("pi_ram", (10.0, 12.0, 1.2), location=(PORT_X + 10.0, PI_Y + 6.0, PI_Z + 1.4), material=mat_chip)
# PMIC / small ICs
add_box("pi_pmic", (6.0, 6.0, 1.0), location=(PORT_X - 16.0, PI_Y - 5.0, PI_Z + 1.3), material=mat_chip)
add_box("pi_ic_a", (4.0, 4.5, 0.9), location=(PORT_X + 16.0, PI_Y - 10.0, PI_Z + 1.25), material=mat_chip)
add_box("pi_ic_b", (5.0, 3.5, 0.9), location=(PORT_X - 18.0, PI_Y + 18.0, PI_Z + 1.25), material=mat_chip)

# Capacitors / inductors (scattered cans and boxes)
for i, (dx, dy) in enumerate([(-12, -18), (-8, -20), (8, -22), (14, -16), (-20, 10), (18, 14), (0, -8)]):
    add_cylinder(f"pi_cap_{i}", radius=1.1, depth=2.0, location=(PORT_X + dx, PI_Y + dy, PI_Z + 1.6), material=mat_silver, vertices=10)
for i, (dx, dy, sx, sy) in enumerate([(-6, 20, 3.2, 2.0), (6, 22, 2.8, 1.8), (12, -4, 3.5, 2.2)]):
    add_box(f"pi_inductor_{i}", (sx, sy, 1.4), location=(PORT_X + dx, PI_Y + dy, PI_Z + 1.5), material=mat_dark)

# USB-A / Ethernet block on -Y edge (opposite SD)
usb_y = PI_Y - PI_D * 0.5 + 8.0
add_box("pi_ethernet", (16.0, 14.0, 13.5), location=(PORT_X - 12.0, usb_y, PI_Z + 7.0), material=mat_metal)
add_box("pi_usb_stack", (14.0, 14.0, 15.0), location=(PORT_X + 8.0, usb_y, PI_Z + 7.8), material=mat_metal)
add_box("pi_usb_inner_a", (5.5, 10.0, 4.0), location=(PORT_X + 4.5, usb_y - 3.0, PI_Z + 10.0), material=mat_black)
add_box("pi_usb_inner_b", (5.5, 10.0, 4.0), location=(PORT_X + 11.5, usb_y - 3.0, PI_Z + 10.0), material=mat_black)

# HDMI + USB-C power on -X long edge
add_box("pi_hdmi_0", (8.0, 10.0, 4.0), location=(PORT_X - PI_W * 0.5 + 4.0, PI_Y - 8.0, PI_Z + 2.5), material=mat_metal)
add_box("pi_hdmi_1", (8.0, 10.0, 4.0), location=(PORT_X - PI_W * 0.5 + 4.0, PI_Y + 4.0, PI_Z + 2.5), material=mat_metal)
add_box("pi_usbc_power", (7.5, 8.0, 3.2), location=(PORT_X - PI_W * 0.5 + 3.8, PI_Y + 16.0, PI_Z + 2.2), material=mat_metal)

# CSI / DSI flex connectors
add_box("pi_csi", (4.0, 16.0, 2.0), location=(PORT_X + 20.0, PI_Y + 5.0, PI_Z + 1.6), material=mat_black)
add_box("pi_dsi", (4.0, 16.0, 2.0), location=(PORT_X + 20.0, PI_Y - 15.0, PI_Z + 1.6), material=mat_black)

# PCIe FPC connector (Pi 5 style) near GPIO side
add_box("pi_pcie_connector", (4.5, 12.0, 2.4), location=(PORT_X + 18.0, PI_Y + 22.0, PI_Z + 1.8), material=mat_black)

# GPIO header base on +X edge (2x20)
gpio_x = PORT_X + PI_W * 0.5 - 3.2
gpio_y = PI_Y + 6.0
gpio_base_z = PI_Z + PI_T * 0.5 + 1.0
add_box("pi_gpio_plastic", (5.0, 33.0, 2.2), location=(gpio_x, gpio_y, gpio_base_z), material=mat_dark)
# First set: pins rising from Pi
add_pin_grid("gpio_set1", origin=(gpio_x, gpio_y, gpio_base_z + 1.1), rows=20, cols=2, pitch=2.54, height=8.5, radius=0.35, material=mat_gold)

# -----------------------------------------------------------------------------
# NVMe carriage + drive between boards + PCIe flex
# -----------------------------------------------------------------------------
nvme_z = PI_Z + PI_T * 0.5 + STACK_GAP * 0.45
# NVMe stays behind the groove wall (does not stick into the opening)
add_box("nvme_carriage", (28.0, 64.0, 1.2), location=(PORT_X - 2.0, PI_Y - 2.0, nvme_z - 1.4), material=mat_metal)
add_box("nvme_drive", (22.0, 66.0, 2.2), location=(PORT_X - 2.0, PI_Y - 2.0, nvme_z), material=mat_nvme)
add_box("nvme_label", (14.0, 28.0, 0.3), location=(PORT_X - 2.0, PI_Y + 2.0, nvme_z + 1.25), material=mat_nvme_label)
add_box("nvme_controller", (8.0, 8.0, 0.8), location=(PORT_X - 6.0, PI_Y - 20.0, nvme_z + 1.5), material=mat_chip)
# PCIe flex ribbon from Pi connector up to carriage
add_box(
    "pcie_flex",
    (3.0, 18.0, STACK_GAP * 0.55),
    location=(PORT_X + 16.0, PI_Y + 22.0, PI_Z + PI_T * 0.5 + STACK_GAP * 0.28),
    material=mat_pcie,
)

# -----------------------------------------------------------------------------
# Standoffs (4 corners) + second GPIO extension set into HAT
# -----------------------------------------------------------------------------
standoff_h = STACK_GAP - 1.0
standoff_r = 1.8
corners = [
    (PORT_X - PI_W * 0.5 + 4.0, PI_Y - PI_D * 0.5 + 4.0),
    (PORT_X + PI_W * 0.5 - 4.0, PI_Y - PI_D * 0.5 + 4.0),
    (PORT_X - PI_W * 0.5 + 4.0, PI_Y + PI_D * 0.5 - 4.0),
    (PORT_X + PI_W * 0.5 - 4.0, PI_Y + PI_D * 0.5 - 4.0),
]
for i, (cx, cy) in enumerate(corners):
    add_cylinder(
        f"standoff_{i}",
        radius=standoff_r,
        depth=standoff_h,
        location=(cx, cy, PI_Z + PI_T * 0.5 + standoff_h * 0.5),
        material=mat_silver,
        vertices=12,
    )
    # screw head on top
    add_cylinder(
        f"standoff_screw_{i}",
        radius=1.3,
        depth=1.0,
        location=(cx, cy, HAT_Z + 1.2),
        material=mat_metal,
        vertices=10,
    )

# Second GPIO extension set (taller stacking through to HAT)
add_pin_grid(
    "gpio_set2",
    origin=(gpio_x, gpio_y, gpio_base_z + 1.1 + 8.0),
    rows=20,
    cols=2,
    pitch=2.54,
    height=max(3.5, STACK_GAP - 3.5),
    radius=0.32,
    material=mat_gold,
)

# -----------------------------------------------------------------------------
# HAT board (roughly Pi-sized) with components
# -----------------------------------------------------------------------------
hat = add_box("hat_pcb", (PI_W - 1.0, PI_D - 2.0, 1.6), location=(PORT_X, SD_EDGE_Y - (PI_D - 2.0) * 0.5, HAT_Z), material=mat_hat)
add_box("hat_gpio_socket", (5.2, 33.0, 4.5), location=(gpio_x, gpio_y, HAT_Z - 2.0), material=mat_dark)
add_box("hat_chip_b", (8.0, 8.0, 1.2), location=(PORT_X + 14.0, PI_Y - 16.0, HAT_Z + 1.4), material=mat_chip)
add_box("hat_header_aux", (8.0, 12.0, 3.5), location=(PORT_X - 18.0, PI_Y - 22.0, HAT_Z + 2.4), material=mat_dark)
for i, (dx, dy) in enumerate([(-14, -24), (12, -22), (18, 18)]):
    add_cylinder(f"hat_cap_{i}", radius=1.0, depth=1.8, location=(PORT_X + dx, PI_Y + dy, HAT_Z + 1.7), material=mat_silver, vertices=10)

# BM1366 miner ASIC + heatsink / shield on the HAT
mat_miner = mat("MinerASIC", (0.06, 0.06, 0.07), metallic=0.35, roughness=0.38)
mat_heatsink = mat("MinerHeatsink", (0.62, 0.62, 0.64), metallic=1.0, roughness=0.32)
mat_fan = mat("MinerFan", (0.04, 0.04, 0.045), metallic=0.08, roughness=0.48)
mat_fan_hub = mat("MinerFanHub", (0.12, 0.12, 0.13), metallic=0.2, roughness=0.4)
miner_x, miner_y = PORT_X - 4.0, PI_Y + 4.0
add_box("bm1366_package", (16.0, 16.0, 1.8), location=(miner_x, miner_y, HAT_Z + 1.7), material=mat_miner)
add_box("bm1366_die_mark", (8.0, 8.0, 0.25), location=(miner_x, miner_y, HAT_Z + 2.7), material=mat_silk)
# Compact aluminum heatsink stack above the ASIC
add_box("miner_heatsink_base", (18.0, 18.0, 1.2), location=(miner_x, miner_y, HAT_Z + 3.4), material=mat_heatsink)
for i, dy in enumerate([-6.0, -2.0, 2.0, 6.0]):
    add_box(
        f"miner_heatsink_fin_{i}",
        (16.5, 1.4, 4.5),
        location=(miner_x, miner_y + dy, HAT_Z + 6.0),
        material=mat_heatsink,
    )

# 25mm-ish axial fan sitting on the heatsink / HAT clearance
fan_z = HAT_Z + 9.2
fan_r = 12.5
add_cylinder("miner_fan_housing", radius=fan_r, depth=6.0, location=(miner_x, miner_y, fan_z), material=mat_fan, vertices=28)
add_cylinder("miner_fan_bore", radius=fan_r - 1.4, depth=6.2, location=(miner_x, miner_y, fan_z), material=mat_black, vertices=28)
add_cylinder("miner_fan_hub", radius=3.2, depth=3.2, location=(miner_x, miner_y, fan_z + 0.4), material=mat_fan_hub, vertices=16)
for i in range(5):
    ang = i * (2.0 * math.pi / 5.0)
    blade = add_box(
        f"miner_fan_blade_{i}",
        (9.5, 2.2, 1.2),
        location=(
            miner_x + math.cos(ang) * 5.2,
            miner_y + math.sin(ang) * 5.2,
            fan_z + 0.6,
        ),
        rotation=(0.0, 0.0, ang),
        material=mat_fan,
    )
# Fan corner mounting tabs / screws onto HAT
for i, (dx, dy) in enumerate([(-11.5, -11.5), (11.5, -11.5), (-11.5, 11.5), (11.5, 11.5)]):
    add_box(
        f"miner_fan_tab_{i}",
        (3.2, 3.2, 1.0),
        location=(miner_x + dx, miner_y + dy, HAT_Z + 2.2),
        material=mat_dark,
    )
    add_cylinder(
        f"miner_fan_screw_{i}",
        radius=0.7,
        depth=1.4,
        location=(miner_x + dx, miner_y + dy, HAT_Z + 2.9),
        material=mat_silver,
        vertices=8,
    )

# -----------------------------------------------------------------------------
# Case USB-C receptacle aligned to the outer pill hole, then plugged cable
# -----------------------------------------------------------------------------
add_box("usbc_shell", (8.6, 6.5, 3.0), location=(PORT_X, PORT_Y_FACE - 3.2, USB_Z), material=mat_metal)
add_box("usbc_inner", (6.8, 5.2, 1.9), location=(PORT_X, PORT_Y_FACE - 2.2, USB_Z), material=mat_black)
add_box("usbc_tongue", (5.6, 4.0, 0.4), location=(PORT_X, PORT_Y_FACE - 1.4, USB_Z), material=mat_metal)

# Metal tip mostly inside the receptacle — only a short lip shows outside
add_stadium(
    "usbc_plug_metal",
    length=7.8,
    width=9.5,
    height=USB_HOLE_H,
    location=(PORT_X, PORT_Y_FACE - 4.2, USB_Z),
    material=mat_metal,
    segments=18,
)
# Boot sits tight against the outer face
add_stadium(
    "usbc_plug_boot",
    length=10.5,
    width=5.5,
    height=3.6,
    location=(PORT_X, PORT_Y_FACE + 2.6, USB_Z),
    material=mat_black,
    segments=18,
)
shield_y = PORT_Y_FACE + 9.5
shield_depth = 12.0
add_stadium(
    "usbc_plug_shield",
    length=13.5,
    width=shield_depth,
    height=5.6,
    location=(PORT_X, shield_y, USB_Z),
    material=mat_strain,
    segments=20,
)

# Cable exits straight from the back face, then gently curves — no immediate droop
cable_start_y = shield_y + shield_depth * 0.5 + 0.15
curve_data = bpy.data.curves.new("usbc_cable_curve", type="CURVE")
curve_data.dimensions = "3D"
curve_data.resolution_u = 28
curve_data.bevel_depth = 1.35
curve_data.bevel_resolution = 5
curve_data.fill_mode = "FULL"
spline = curve_data.splines.new("NURBS")
pts = [
    (PORT_X, cable_start_y, USB_Z),
    (PORT_X, cable_start_y + 12.0, USB_Z),
    (PORT_X, cable_start_y + 22.0, USB_Z),
    (PORT_X + 6.0, cable_start_y + 32.0, USB_Z - 0.8),
    (PORT_X + 22.0, cable_start_y + 38.0, USB_Z - 2.5),
    (PORT_X + 45.0, cable_start_y + 40.0, USB_Z - 6.0),
    (PORT_X + 65.0, cable_start_y + 38.0, USB_Z - 12.0),
]
spline.points.add(len(pts) - 1)
for i, p in enumerate(pts):
    spline.points[i].co = (*p, 1.0)
spline.use_endpoint_u = True
spline.order_u = 4
cable_ob = bpy.data.objects.new("usbc_cable", curve_data)
bpy.context.collection.objects.link(cable_ob)
bpy.context.view_layer.objects.active = cable_ob
cable_ob.select_set(True)
bpy.ops.object.convert(target="MESH")
cable = bpy.context.active_object
cable.name = "usbc_cable"
cable.data.materials.clear()
cable.data.materials.append(mat_cable)

# -----------------------------------------------------------------------------
# Square LCD/screen to body, matte LCD material, shiny copper bezel
# -----------------------------------------------------------------------------
# Source LCD/screen sit at ~-89.3° Z while bezel/body are at 0° — that ~0.7°
# skew shows up as a tilted pixel grid vs the copper frame. Snap object euler to
# nearest 90°, bake it into verts, then remove any residual in-mesh Z skew so the
# top face is axis-aligned with the bezel before UVs are assigned.
def _bake_rotation(ob):
    mat = ob.rotation_euler.to_matrix().to_4x4()
    ob.data.transform(mat)
    ob.rotation_euler = (0.0, 0.0, 0.0)
    ob.data.update()


def _axis_align_top_face(ob):
    """Rotate mesh in Z so the top-face XY edges sit on the world axes."""
    bpy.context.view_layer.update()
    world = [ob.matrix_world @ v.co for v in ob.data.vertices]
    zmax = max(p.z for p in world)
    tops = [p for p in world if p.z >= zmax - 0.05]
    if len(tops) < 2:
        return 0.0
    # Unique corners (rounded), then measure one top-face edge angle.
    uniq = {}
    for p in tops:
        uniq[(round(p.x, 4), round(p.y, 4))] = (p.x, p.y)
    pts = list(uniq.values())
    if len(pts) < 2:
        return 0.0
    cx = sum(x for x, _ in pts) / len(pts)
    cy = sum(y for _, y in pts) / len(pts)
    ordered = sorted(pts, key=lambda p: math.atan2(p[1] - cy, p[0] - cx))
    dx = ordered[1][0] - ordered[0][0]
    dy = ordered[1][1] - ordered[0][1]
    ang = math.atan2(dy, dx)
    snap = round(ang / (math.pi / 2.0)) * (math.pi / 2.0)
    delta = snap - ang
    if abs(delta) < 1e-8:
        return 0.0
    # Correct in local space. With object rotation already baked to 0, local≈world XY.
    fix = Matrix.Rotation(delta, 4, "Z")
    ob.data.transform(fix)
    ob.data.update()
    return math.degrees(delta)


for name in ("lcd", "screen"):
    ob = bpy.data.objects.get(name)
    if not ob:
        continue
    z = ob.rotation_euler.z
    ob.rotation_euler.z = round(z / (math.pi / 2.0)) * (math.pi / 2.0)

bpy.context.view_layer.update()
for name in ("lcd", "screen"):
    ob = bpy.data.objects.get(name)
    if not ob:
        continue
    print(
        "SQUARE_LCD",
        name,
        "euler_deg",
        [round(math.degrees(a), 4) for a in ob.rotation_euler],
        "local0",
        [round(c, 5) for c in ob.data.vertices[0].co],
    )
    _bake_rotation(ob)
    # Residual in-mesh skew correction is only safe on the flat LCD quad.
    # The screen bezel surround has rounded corners that fool edge picking.
    if name == "lcd":
        deg = _axis_align_top_face(ob)
        print("SQUARE_LCD_ALIGN", name, "delta_deg", round(deg, 4))

bpy.context.view_layer.update()
bezel = bpy.data.objects.get("bezel")
if bezel:
    bezel_bb = [bezel.matrix_world @ Vector(c) for c in bezel.bound_box]
    bezel_cx = 0.5 * (min(p.x for p in bezel_bb) + max(p.x for p in bezel_bb))
    bezel_cy = 0.5 * (min(p.y for p in bezel_bb) + max(p.y for p in bezel_bb))
    for name in ("lcd", "screen"):
        ob = bpy.data.objects.get(name)
        if not ob:
            continue
        bb = [ob.matrix_world @ Vector(c) for c in ob.bound_box]
        cx = 0.5 * (min(p.x for p in bb) + max(p.x for p in bb))
        cy = 0.5 * (min(p.y for p in bb) + max(p.y for p in bb))
        ob.location.x += bezel_cx - cx
        ob.location.y += bezel_cy - cy
    # Required so later matrix_world reads/writes see the new locations.
    bpy.context.view_layer.update()
lcd_chk = bpy.data.objects.get("lcd")
if lcd_chk:
    print(
        "SQUARE_LCD_VERIFY",
        "local0",
        [round(c, 5) for c in lcd_chk.data.vertices[0].co],
    )

img = load_image(POSTER, check_existing=True)
img.pack()
lcd = bpy.data.objects["lcd"]
mesh = lcd.data
if not mesh.uv_layers:
    mesh.uv_layers.new(name="UVMap")
uv_layer = mesh.uv_layers.active.data
# UV from the upward screen face only (ignore side/bottom verts).
screen_xs = []
screen_ys = []
for poly in mesh.polygons:
    if abs(poly.normal.z) < 0.9:
        continue
    for vi in poly.vertices:
        co = mesh.vertices[vi].co
        screen_xs.append(co.x)
        screen_ys.append(co.y)
if screen_xs and screen_ys:
    xmin, xmax = min(screen_xs), max(screen_xs)
    ymin, ymax = min(screen_ys), max(screen_ys)
else:
    xs = [v.co.x for v in mesh.vertices]
    ys = [v.co.y for v in mesh.vertices]
    xmin, xmax = min(xs), max(xs)
    ymin, ymax = min(ys), max(ys)
xspan = (xmax - xmin) or 1.0
yspan = (ymax - ymin) or 1.0
for poly in mesh.polygons:
    is_screen = abs(poly.normal.z) >= 0.9
    for li in poly.loop_indices:
        co = mesh.vertices[mesh.loops[li].vertex_index].co
        if is_screen:
            uv_layer[li].uv = (1.0 - (co.x - xmin) / xspan, 1.0 - (co.y - ymin) / yspan)
        else:
            uv_layer[li].uv = (0.0, 0.0)

mat_m = bpy.data.materials["mempool"]
nt = mat_m.node_tree
tex = bsdf = tcoord = None
for n in list(nt.nodes):
    if n.type == "TEX_IMAGE":
        tex = n
    elif n.type == "BSDF_PRINCIPLED":
        bsdf = n
    elif n.type == "TEX_COORD":
        tcoord = n
    elif n.type == "MAPPING":
        nt.nodes.remove(n)
if not tcoord:
    tcoord = nt.nodes.new("ShaderNodeTexCoord")
tex.image = img
tex.extension = "CLIP"
for l in list(nt.links):
    if (l.to_node == tex and l.to_socket.name == "Vector") or (
        l.to_node == bsdf and l.to_socket.name in ("Base Color", "Emission Color")
    ):
        nt.links.remove(l)
nt.links.new(tcoord.outputs["UV"], tex.inputs["Vector"])
nt.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
nt.links.new(tex.outputs["Color"], bsdf.inputs["Emission Color"])
bsdf.inputs["Emission Strength"].default_value = 0.55
bsdf.inputs["Metallic"].default_value = 0.0
bsdf.inputs["Roughness"].default_value = 0.95
if "Specular IOR Level" in bsdf.inputs:
    bsdf.inputs["Specular IOR Level"].default_value = 0.05
elif "Specular" in bsdf.inputs:
    bsdf.inputs["Specular"].default_value = 0.05
if "Sheen Weight" in bsdf.inputs:
    bsdf.inputs["Sheen Weight"].default_value = 0.0
if "Coat Weight" in bsdf.inputs:
    bsdf.inputs["Coat Weight"].default_value = 0.0

bezel_mat = bpy.data.materials["Material"]
bbsdf = next(n for n in bezel_mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
bbsdf.inputs["Base Color"].default_value = (0.955, 0.637, 0.408, 1.0)
bbsdf.inputs["Metallic"].default_value = 1.0
bbsdf.inputs["Roughness"].default_value = 0.18

smat = bpy.data.materials.get("Material.005")
if smat:
    sbsdf = next(n for n in smat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    sbsdf.inputs["Metallic"].default_value = 0.0
    sbsdf.inputs["Roughness"].default_value = 0.85

# Normalize using device-only bounds so cable doesn't shrink the product
device_names = {"bezel", "body", "lcd", "screen"}
dpts = []
for o in bpy.context.scene.objects:
    if o.type == "MESH" and o.name in device_names:
        dpts.extend([o.matrix_world @ Vector(c) for c in o.bound_box])
mn = Vector((min(p.x for p in dpts), min(p.y for p in dpts), min(p.z for p in dpts)))
mx = Vector((max(p.x for p in dpts), max(p.y for p in dpts), max(p.z for p in dpts)))
center = (mn + mx) / 2
extent = max((mx - mn).x, (mx - mn).y, (mx - mn).z) or 1.0
transform = Matrix.Scale(2.4 / extent, 4) @ Matrix.Translation(-center)
for o in list(bpy.context.scene.objects):
    if o.type in ("LIGHT", "CAMERA"):
        continue
    if o.parent is not None:
        continue
    o.matrix_world = transform @ o.matrix_world

bpy.ops.object.select_all(action="DESELECT")
for o in bpy.context.scene.objects:
    if o.type == "MESH":
        o.select_set(True)
bpy.ops.export_scene.gltf(
    filepath=OUT_GLB,
    export_format="GLB",
    export_apply=True,
    export_texcoords=True,
    export_normals=True,
    export_materials="EXPORT",
    export_image_format="AUTO",
    use_selection=True,
)
print("EXPORT_OK", sum(1 for o in bpy.context.scene.objects if o.type == "MESH"))
