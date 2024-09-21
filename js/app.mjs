import { ContextMenu } from "./modules/ContextMenu.mjs";
import { SimpleText } from "./modules/generics/SimpleText.mjs";
import { TransformBox } from "./modules/TransformBox.mjs";

let demo_menu = new ContextMenu([
    {
        name: "Add Simple Text",
        isCheckBox: false,
        func: (event) => {
            let tb = new TransformBox(event.clientX, event.clientY, 10, 300, 150)
            let new_txt = new SimpleText(tb.DOM_inner)
            tb.Render()
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

