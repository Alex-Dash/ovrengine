import { UUIDv4 } from "./Utils.mjs"
class ContextMap {
    constructor(){
        this.type_prefix_map = new Map()
        this.uuid_map = new Map()
        return this
    }

    _getUniqueNamesAsSet(type_prefix = "00000000-0000"){
        let s = new Set()
        let prefix_info = this.type_prefix_map.get(type_prefix)
        if(!type_prefix){
            return s
        }
        for (const component of prefix_info.components.values()) {
            s.add(component.unique_name)
        }

        return s
    }

    RegisterComponent(component){
        if(!component){
            throw Error("Cannot register a component: Component was not defined")
        }
        if(!component.meta){
            throw Error("Cannot register a component: Component meta was not defined")
        }
        let type_prefix = (component.meta.type_prefix || "00000000-0000").toLowerCase().trim()
        if(!this.type_prefix_map.get(type_prefix)){
            this.type_prefix_map.set(type_prefix, {
                typename: component.meta.name || "Unknown",
                typegroup: component.meta.group || "Custom",
                components: new Map()
            })
        }
        if(!component.meta.uuid){
            component.meta.uuid = UUIDv4(type_prefix)
        }

        this.type_prefix_map.get(type_prefix).components.set(component.meta.uuid, component)
        this.uuid_map.set(component.meta.uuid, component)

        let component_unique_name = component.meta.unique_name || this.type_prefix_map.get(type_prefix).typename
        let name_iter = 1
        while (this._getUniqueNamesAsSet(type_prefix).has(component_unique_name)){
            // name is not unique, regenerate it
            component_unique_name = `${this.type_prefix_map.get(type_prefix).typename} [${this.type_prefix_map.get(type_prefix).components.size + name_iter}]`;
            name_iter ++;
        }
        component.meta.unique_name = component_unique_name
    }

    UnRegisterComponent(component){
        let uuid_unreg_success = this.uuid_map.delete(component.uuid)
        let c_prefix = component.type_prefix || "00000000-0000"

        if(!uuid_unreg_success){
            console.warn("Failed to unregister component by UUID: UUID does not exist")
        }

        if(!this.type_prefix_map.get(c_prefix)){
            console.warn("Failed to unregister component in type category by UUID: Category does not exist")
            return
        }
        let type_unreg_success = this.type_prefix_map.get(c_prefix).components.delete(component.uuid)

        if(!type_unreg_success){
            console.warn("Failed to unregister component in type category by UUID: UUID in category does not exist")
        }
        
        // check if type category is now empty
        if(this.type_prefix_map.get(c_prefix).components.size === 0){
            // category is empty, remove from active
            this.type_prefix_map.delete(c_prefix)
        }
    }

    GetComponentTreeByType(){
        let ret = {}
        
        for (const type_prefix of this.type_prefix_map.keys()) {
            let collection_info = this.type_prefix_map.get(type_prefix)
            ret[type_prefix] = {
                typename: collection_info.typename,
                typegroup: collection_info.typegroup,
                components: []
            }
            for (const component_uuid of this.type_prefix_map.get(type_prefix).components.keys()) {
                let component = this.type_prefix_map.get(type_prefix).components.get(component_uuid)
                ret[type_prefix].push(component)
            }
        }

        return ret
    }
}

export { ContextMap }