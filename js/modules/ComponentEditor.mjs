class ComponentEditor {
    constructor(component){
        if(!component || !component.props || !Object.keys(component.props).length){
            console.warn("ComponentEditor(): Component doesn't implement necessary interfaces")
            return 
        }
        this.props = component.props
        this.DOM_root = document.createElement("div")
        this.DOM_root.classList.add("comp-editor")
        
        this.active_id = 0

        let e_body = document.createElement("div")
        e_body.classList.add("comp-editor-body")

        let e_header = document.createElement("div")
        e_header.classList.add("editor-header")
        e_header.classList.add("noselect")
        e_header.innerText = `Edit: ${component?.meta?.name || "Component"}`
        e_body.append(e_header)

        let e_tabs = document.createElement("div")
        e_tabs.classList.add("editor-tabs")
        e_body.append(e_tabs)
        this.DOM_tabs = e_tabs

        let e_content = document.createElement("div")
        e_content.classList.add("editor-content")
        e_body.append(e_content)
        this.DOM_content = e_content
        
        let e_footer = document.createElement("div")
        e_footer.classList.add("editor-footer")
        e_footer.classList.add("noselect")
        
        let btn_save = document.createElement("div")
        btn_save.classList.add("btn")
        btn_save.classList.add("btn-green")
        btn_save.innerText = "Save & Close"
        btn_save.addEventListener("click", (event)=>{
            this.Close()
        })
        e_footer.append(btn_save)

        e_body.append(e_footer)

        this.tablist = new Set()
        Object.keys(this.props).map(e=>this.props[e].tab || "Settings").forEach(e=>{
            this.tablist.add(e)
        })

        if(component?.meta?.about){
            this.tablist.add("About")
        }
        if(component?.meta?.credits){
            this.tablist.add("Credits")
        }

        this.tablist = [...this.tablist.values()]

        for (const tab_id in this.tablist) {
            let tabname = this.tablist[tab_id]
            let is_active = tab_id == this.active_id

            

            let tab = document.createElement("div")
            tab.addEventListener("click", (event)=>{
                this._switch_tab(tab_id)
            })
            tab.innerText = tabname
            e_tabs.append(tab)

            let tab_content = document.createElement("div")
            tab_content.classList.add("tab-content")
            if(tabname == "About"){
                let cnt = document.createElement("p")
                cnt.innerText = component?.meta?.about || ""
                tab_content.append(cnt)
            }
            if(tabname == "Credits"){
                let cnt = document.createElement("p")
                cnt.innerText = component?.meta?.credits || ""
                tab_content.append(cnt)
            }
            if(is_active){
                tab.setAttribute("active", "true")
                tab_content.setAttribute("active", "true")
            }

            // populate inputs
            this._populate_inputs(tab_id, tab_content)
            e_content.append(tab_content)
        }


        this.DOM_root.append(e_body)

        if(window.OVRE.current_editor){
            window.OVRE.current_editor.Close()
        }
        
        document.body.prepend(this.DOM_root)
        window.OVRE.current_editor = this
    }

    Close(){
        if(this.DOM_root){
            this.DOM_root.remove()
        }
        window.OVRE.current_editor = undefined
    }

    _populate_inputs(tab_id, parent){
        let tab_name = this.tablist[tab_id]

        // pull only relevant props for this tab
        let props = Object.keys(this.props)
            .filter(e=>this.props[e].tab === tab_name)
            .map(e=>this.props[e])
            .sort((a,b)=>((a.index || 0)-(b.index || 0)))

        for (const prop of props) {
            let element
            switch (prop.type) {
                case "int":
                    element = document.createElement("input")
                    element.type = "number"
                    element.value = prop.value
                    element.addEventListener("wheel",(e)=>{
                        this._onscroll(e, element)
                        if(typeof prop.onUpdate === "function"){
                            prop.onUpdate(element.value)
                        }
                    })
                    break;

                case "longtext":
                    element = document.createElement("textarea")
                    element.rows = 5
                    element.value = prop.value
                    break;

                case "colorRGB":
                    element = document.createElement("input")
                    element.type = "color"
                    element.value = prop.value
                    break;

                case "float":
                    element = document.createElement("input")
                    element.type = "number"
                    element.step = 0.01
                    element.value = prop.value
                    element.addEventListener("wheel",(e)=>{
                        this._onscroll(e, element)
                        if(typeof prop.onUpdate === "function"){
                            prop.onUpdate(element.value)
                        }
                    })
                    break;
            
                default:
                    console.warn(`ComponentEditor: Unrecognized type ${prop.type}`)
                    break;
            }
            if(!element){
                continue
            }

            element.addEventListener("change", (event)=>{
                if(typeof prop.onUpdate === "function"){
                    console.log("onUpdate:", event)
                    prop.onUpdate(element.value)
                }
            })

            let wrap = document.createElement("div")
            
            let e_title = document.createElement("div")
            e_title.classList.add("inp-title")
            e_title.innerText = prop.title || "Unnamed setting"
            wrap.append(e_title)

            if(prop.desc){
                let e_desc = document.createElement("div")
                e_desc.classList.add("inp-desc")
                e_desc.innerText = prop.desc
                wrap.append(e_desc)
            }

            wrap.append(element)
            // wrap.append(document.createElement("hr"))
            parent.append(wrap)
        }
    }

    _switch_tab(to_id){
        for (let tab_id = 0; tab_id<this.DOM_tabs.children.length; tab_id++) {
            if(to_id == tab_id){
                // set active
                this.DOM_tabs.children[tab_id].setAttribute("active", "true")
                this.DOM_content.children[tab_id].setAttribute("active", "true")
            } else {
                // unset
                this.DOM_tabs.children[tab_id].removeAttribute("active")
                this.DOM_content.children[tab_id].removeAttribute("active")
            }
        }
        this.active_id = to_id
    }

    _onscroll(event, target){
        let step = parseFloat(target.step+"" || "0.1")
        if(Math.round(step) === step || target.step === "" || target.step === undefined){
            step = 1
        }
        let val
        try {
            val = Number(target.value)
        } catch (error) {
            console.warn("Input scroll: Failed to parse a number", error)
            return
        }
        if(isNaN(val) || val === undefined){
            console.warn("Input scroll: invalid value for a number")
            return
        }

        if(event.wheelDelta>0){
            target.value = Math.round((val+step)*100000)/100000
        } else {
            target.value = Math.round((val-step)*100000)/100000
        }
        
    }
}

export { ComponentEditor }