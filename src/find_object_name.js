

export default function find_object_name(intersections)
{

    let intersected_object_in_blender = NaN;

    if ( intersections.length > 0 ) {

        let object = intersections[0].object
    
        while(object.type != 'Object3D')
        {
          object = object.parent;
        }
    
        while (object.parent.type == 'Object3D')
        {
          object = object.parent;
        }
    
        intersected_object_in_blender = object;

    }

    
    return intersected_object_in_blender;
}



