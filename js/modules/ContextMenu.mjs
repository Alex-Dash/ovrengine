class ContextMenu {
    constructor(options = []) {
        if(options.length == 0){
            return undefined
        }
        this.options = options
        return this
    }

    Close(){
        if(!this.instance){
            return
        }
        this.instance.remove()
        this.instance = undefined
    }

    Render(x=0,y=0){

        // prevent double instancing
        this.Close()

        if(!this?.options || this?.options?.length<1){
            console.warn("Context Menu Render(): No valid instance was created")
            return
        }

        let node_root = document.createElement("div")
        node_root.classList.add("ctx-clickaway")
        node_root.addEventListener("click", (event)=>{
            this.Close()
        })
        node_root.addEventListener("contextmenu", (event)=>{
            this.Close()
        })

        let menu_node = document.createElement("div")
        menu_node.classList.add("ctx-menu")
        menu_node.style.cssText = `--x_pos: ${x}px; --y_pos: ${y}px;`
        for (const opt of this.options) {
            let item = document.createElement("div")
            item.classList.add("ctx-option")
            item.innerText = opt?.name || "Unknown name"
            item.addEventListener("click", (m_ev)=>{
                opt.func()
                this.Close()
            })
            menu_node.append(item)
        }

        node_root.append(menu_node)
        this.instance = node_root
        document.body.prepend(node_root)
    }
}

export { ContextMenu }