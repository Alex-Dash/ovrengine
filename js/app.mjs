import { ContextMenu } from "./modules/ContextMenu.mjs";
import { SimpleText } from "./modules/generics/SimpleText.mjs";

let demo_menu = new ContextMenu([
    {
        name: "Add",
        isCheckBox: false,
        func: () => {
            let new_txt = new SimpleText()
            new_txt.Render()
        }
    },
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