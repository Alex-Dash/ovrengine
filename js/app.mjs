import { ContextMap } from "./modules/ContextMap.mjs";
import { ContextMenu } from "./modules/ContextMenu.mjs";
import { TransformBox } from "./modules/TransformBox.mjs";
window.OVRE = {}

const default_library = [
    "./modules/generics/SimpleText.mjs"
]

window.OVRE.default = {}
window.OVRE.context = {}
window.OVRE.context.default = new ContextMap()

async function loadLibs(){
    for (const lib of default_library) {
        try {
            let module = await import(lib)
            let module_name = module.default.meta.name.replaceAll(" ","")
            window.OVRE.default[module_name] = module.default
            console.log(`Component loader: Loaded ${module_name} as window.OVRE.default.${module_name}`)
        } catch (error) {
            console.error("Failed to load module: ", error)
        }
    }
}

async function main() {
    await loadLibs()

    let default_components = []
    for (const key of Object.keys(window.OVRE.default)) {
        default_components.push({
            name: `Add ${window.OVRE.default[key].meta.name}`,
            isCheckBox: window.OVRE.default[key].meta.isCheckBox || false,
            func: (event) => {
                let tb = new TransformBox(event.clientX, event.clientY, 10, 300, 150)
                let elem = new window.OVRE.default[key](tb.DOM_inner)
                tb.Render()
                elem.Render()
            }
        })
    }

    let demo_menu = new ContextMenu([ ...default_components,
        {
            name: "Lock Controls for this view",
            isCheckBox: false,
            func: () => {
                console.log("Locking controls function awawaw")
            }
        },
    ])
    
    document.body.addEventListener("contextmenu", event=>{
        event.preventDefault()
        event.stopPropagation()
        demo_menu.Render(event.clientX, event.clientY)
        console.log(event)
    })
}

main()
