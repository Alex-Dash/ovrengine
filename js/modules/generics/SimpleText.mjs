import { ContextMenu } from "../ContextMenu.mjs"

class SimpleText {
    constructor(parent, content = "Sample Text\nWith new line") {
        if(!parent){
            console.warn("SimpleText creation: Parent was not specified, unable to add element.")
            return undefined
        }
        this.parent = parent
        this.props = {
            content:{
                value: content,
                type:"longtext",
                onUpdate: (v)=>this.SetContent(v)
            },
            size:{
                value: 30,
                type: "int",
                onUpdate: (v)=>this.SetSize(v)
            },
            color:{
                value: "#FF00FF",
                tyoe: "colorRGB",
                onUpdate: (v)=>this.SetColor(v)
            },
            alpha:{
                value: 0.7,
                type: "float",
                onUpdate: (v)=>this.SetAlpha(v)
            },
        }
        this.x = x
        this.y = y
        this.context_menu_opts=[
            {
                name: "Delete",
                isCheckBox: false,
                func: () => {
                    this.Remove()
                }
            },
        ]
        return this
    }
    SetContent(new_content = ""){
        this.props.content.value = new_content
        this.Render()
    }
    SetSize(new_size = 20){
        this.props.size.value = new_size
        this.Render()
    }
    SetColor(new_color = "#606060"){
        this.props.color.value = new_color
        this.Render()
    }
    SetAlpha(new_alpha=0.7){
        this.props.alpha.value = new_alpha
        this.Render()
    }

    Remove(){
        if(this.instance){
            this.instance.remove()
        }
    }

    Render(force_re_render = false){
        if(force_re_render && this.instance){
            this.instance.remove()
        }

        let root_node
        if(this.instance){
            root_node = this.instance
        } else {
            root_node = document.createElement("div")
            root_node.classList.add("simple-text")
        }

        root_node.innerHTML = ""
        let paragraphs = this.props.content.value.split("\n")
        for (const paragraph of paragraphs) {
            if(paragraph === ""){
                root_node.append(document.createElement("br"))
            } else {
                let p_node = document.createElement("p")
                p_node.classList.add("simple-text-content")
                p_node.style.cssText = `--a: ${this.props.alpha.value}; --size:${this.props.size.value}px; --clr:${this.props.color.value}`
                p_node.innerText = paragraph
                root_node.append(p_node)
            }
        }

        if(!this.menu){
            let menu = new ContextMenu(this.context_menu_opts)
            root_node.addEventListener("contextmenu", (event)=>{
                event.preventDefault();
                event.stopPropagation()
                menu.Render(event.clientX, event.clientY)
            })
        }

        if(!this.instance) {
            this.instance = root_node
            this.parent.append(root_node)
        }

    }
    
}

export { SimpleText }