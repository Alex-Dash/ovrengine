import { ContextMenu } from "../ContextMenu.mjs"
import { ComponentEditor } from "../ComponentEditor.mjs"

class SimpleText {
    constructor(parent, content = "Sample Text\nWith new line") {
        if(!parent){
            console.warn("SimpleText creation: Parent was not specified, unable to add element.")
            return undefined
        }
        this.parent = parent
        this.meta = {
            name:"Simple Text",
            group:"Generic",
            credits:"Part of the official library\n(git link maybe?)\n\nOwO",
            about:"A generic editable text object"
        }
        this.props = {
            content:{
                tab:"Settings",
                index: 0,
                title: "Text Contents",
                desc: "Text that would be rendered inside",
                value: content,
                type:"longtext",
                onUpdate: (v)=>this.SetContent(v)
            },
            size:{
                tab:"Settings",
                index: 1,
                title: "Font Size",
                desc: "Font Size in pixels",
                value: 30,
                type: "int",
                onUpdate: (v)=>this.SetSize(v)
            },
            color:{
                tab:"Settings",
                index: 2,
                title: "Color",
                desc: "Text color in #RRGGBB format",
                value: "#FF00FF",
                type: "colorRGB",
                onUpdate: (v)=>this.SetColor(v)
            },
            alpha:{
                tab:"Settings",
                index: 3,
                title: "Opacity",
                desc: "Text opacity. 1 - Fully opaque, 0 - Fully transparent",
                value: 0.7,
                type: "float",
                onUpdate: (v)=>this.SetAlpha(v)
            },
        }
        this.context_menu_opts=[
            {
                name: "Edit",
                isCheckBox: false,
                func: () => {
                    let ce = new ComponentEditor(this)
                }
            },
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
        if(this.parent){
            // double parent cuz of the content wrapper
            this.parent.parentElement.remove()
            return
        }
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
            this.parent.addEventListener("contextmenu", (event)=>{
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