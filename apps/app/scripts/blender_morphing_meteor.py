import bpy
import math
import random

# Morphing Meteor Animation Script for Blender
# This creates a meteor that morphs between your eclipse shapes as it flies through space

def create_morphing_meteor_animation():
    """
    Creates a morphing meteor animation using your eclipse images as textures
    """
    
    # Clear existing mesh objects (optional)
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    
    # Create UV Sphere for meteor base
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=64, 
        ring_count=32,
        radius=1,
        location=(0, 0, 0)
    )
    meteor = bpy.context.active_object
    meteor.name = "MorphingMeteor"
    
    # Add shape keys for morphing
    bpy.context.view_layer.objects.active = meteor
    bpy.ops.object.shape_key_add(from_mix=False)
    meteor.data.shape_keys.key_blocks["Basis"].name = "Eclipse1"
    
    # Create morph targets (eclipse shapes)
    for i in range(2, 5):
        bpy.ops.object.shape_key_add(from_mix=False)
        key = meteor.data.shape_keys.key_blocks[-1]
        key.name = f"Eclipse{i}"
        
        # Deform vertices to create eclipse-like shapes
        for j, vert in enumerate(key.data):
            angle = math.atan2(vert.co.y, vert.co.x)
            dist = math.sqrt(vert.co.x**2 + vert.co.y**2)
            
            # Create different deformations for each eclipse
            if i == 2:  # Horizontal stretch
                vert.co.x *= 1.3
                vert.co.y *= 0.7
            elif i == 3:  # Diagonal stretch
                rotation = math.radians(45)
                x = vert.co.x * math.cos(rotation) - vert.co.y * math.sin(rotation)
                y = vert.co.x * math.sin(rotation) + vert.co.y * math.cos(rotation)
                vert.co.x = x * 1.2
                vert.co.y = y * 0.8
            elif i == 4:  # Ring-like shape
                if dist > 0.5:
                    scale = 1.0 + (dist - 0.5) * 0.5
                    vert.co.x *= scale
                    vert.co.y *= scale
                    vert.co.z *= 0.5
    
    # Create material with emission
    mat = bpy.data.materials.new(name="MeteorMaterial")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Clear default nodes
    nodes.clear()
    
    # Add shader nodes
    output = nodes.new('ShaderNodeOutputMaterial')
    emission = nodes.new('ShaderNodeEmission')
    mix_shader = nodes.new('ShaderNodeMixShader')
    transparent = nodes.new('ShaderNodeBsdfTransparent')
    
    # Add texture coordinate and mapping
    tex_coord = nodes.new('ShaderNodeTexCoord')
    mapping = nodes.new('ShaderNodeMapping')
    
    # Create image textures for each eclipse
    image_textures = []
    mix_nodes = []
    
    for i in range(4):
        # Image texture node
        img_tex = nodes.new('ShaderNodeTexImage')
        img_tex.name = f"Eclipse{i+1}"
        # You'll need to load your actual images here
        # img_tex.image = bpy.data.images.load("/path/to/eclipse-{i+1}.jpg")
        image_textures.append(img_tex)
        
        # Mix RGB node for blending
        if i > 0:
            mix_rgb = nodes.new('ShaderNodeMixRGB')
            mix_rgb.blend_type = 'MIX'
            mix_nodes.append(mix_rgb)
    
    # Connect nodes
    links.new(tex_coord.outputs['UV'], mapping.inputs['Vector'])
    
    # Connect textures through mix nodes
    if len(image_textures) > 0:
        links.new(mapping.outputs['Vector'], image_textures[0].inputs['Vector'])
        
        current_output = image_textures[0].outputs['Color']
        for i, mix_node in enumerate(mix_nodes):
            links.new(current_output, mix_node.inputs['Color1'])
            links.new(mapping.outputs['Vector'], image_textures[i+1].inputs['Vector'])
            links.new(image_textures[i+1].outputs['Color'], mix_node.inputs['Color2'])
            current_output = mix_node.outputs['Color']
        
        links.new(current_output, emission.inputs['Color'])
    
    emission.inputs['Strength'].default_value = 5.0
    
    links.new(emission.outputs['Emission'], mix_shader.inputs[1])
    links.new(transparent.outputs['BSDF'], mix_shader.inputs[2])
    links.new(mix_shader.outputs['Shader'], output.inputs['Surface'])
    
    # Assign material
    meteor.data.materials.append(mat)
    
    # Create motion path
    curve = bpy.data.curves.new('MeteorPath', 'CURVE')
    curve.dimensions = '3D'
    spline = curve.splines.new('BEZIER')
    spline.bezier_points.add(3)  # Total of 4 points
    
    # Define path points
    points = [
        (-10, -10, 5),    # Start position
        (-3, 0, 3),       # First curve point
        (3, 0, 2),        # Second curve point
        (10, 10, 0)       # End position
    ]
    
    for i, point in enumerate(spline.bezier_points):
        point.co = points[i]
        point.handle_left = (points[i][0] - 1, points[i][1], points[i][2])
        point.handle_right = (points[i][0] + 1, points[i][1], points[i][2])
    
    # Create curve object
    curve_obj = bpy.data.objects.new('MeteorPath', curve)
    bpy.context.scene.collection.objects.link(curve_obj)
    
    # Add follow path constraint
    constraint = meteor.constraints.new('FOLLOW_PATH')
    constraint.target = curve_obj
    constraint.use_curve_follow = True
    constraint.forward_axis = 'FORWARD_Y'
    constraint.up_axis = 'UP_Z'
    
    # Animate the meteor along the path
    scene = bpy.context.scene
    meteor.location = (0, 0, 0)
    meteor.keyframe_insert(data_path="location", frame=1)
    
    # Animate shape keys for morphing
    shape_keys = meteor.data.shape_keys
    
    for i, key_block in enumerate(shape_keys.key_blocks[1:], 1):
        # Set keyframes for shape key values
        frame_start = (i - 1) * 50 + 1
        frame_peak = i * 50
        frame_end = (i + 1) * 50
        
        # Start at 0
        key_block.value = 0
        key_block.keyframe_insert(data_path="value", frame=frame_start)
        
        # Peak at 1
        key_block.value = 1
        key_block.keyframe_insert(data_path="value", frame=frame_peak)
        
        # Back to 0
        key_block.value = 0
        key_block.keyframe_insert(data_path="value", frame=frame_end)
    
    # Animate texture mixing
    for i, mix_node in enumerate(mix_nodes):
        frame_start = i * 50 + 1
        frame_end = (i + 1) * 50
        
        mix_node.inputs['Fac'].default_value = 0
        mix_node.inputs['Fac'].keyframe_insert(data_path="default_value", frame=frame_start)
        
        mix_node.inputs['Fac'].default_value = 1
        mix_node.inputs['Fac'].keyframe_insert(data_path="default_value", frame=frame_end)
    
    # Create particle trail
    bpy.ops.object.particle_system_add()
    particles = meteor.particle_systems[0]
    particles.settings.count = 1000
    particles.settings.lifetime = 50
    particles.settings.emit_from = 'FACE'
    particles.settings.physics_type = 'NEWTON'
    particles.settings.mass = 0.001
    particles.settings.use_emit_random = True
    particles.settings.render_type = 'HALO'
    particles.settings.particle_size = 0.1
    
    # Add force field for trail effect
    bpy.ops.object.effector_add(type='WIND', location=(0, -5, 0))
    wind = bpy.context.active_object
    wind.field.strength = -100
    wind.field.flow = 0.5
    
    # Set up animation
    scene.frame_start = 1
    scene.frame_end = 200
    
    # Add camera animation
    bpy.ops.object.camera_add(location=(5, -10, 5))
    camera = bpy.context.active_object
    camera.rotation_euler = (1.1, 0, 0.5)
    
    # Make camera track the meteor
    track_constraint = camera.constraints.new('TRACK_TO')
    track_constraint.target = meteor
    track_constraint.track_axis = 'TRACK_NEGATIVE_Z'
    track_constraint.up_axis = 'UP_Y'
    
    print("Morphing meteor animation created!")
    print("Now load your eclipse images into the texture nodes")
    print("Press Space to play the animation")

# Run the script
create_morphing_meteor_animation()
