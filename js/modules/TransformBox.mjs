const ctrl_map = ["N W", "N", "N E", "W", "E", "S W", "S", "S E"]

class TransformBox {
    constructor(x=0, y=0, z=0, width=800, height=600){
        this.x = x
        this.y = y
        this.z = z
        this.width = width
        this.height = height
        this.DOM_root = document.createElement("div")
        this.DOM_root.classList.add("transform-box")
        this.DOM_root.classList.add("noselect")

        this.DOM_inner = document.createElement("div")
        this.DOM_inner.classList.add("tb-content")
        for (const ctrl_dir of ctrl_map) {
            let ctrl = document.createElement("div")
            ctrl.classList.add("tb-controls")
            ctrl.setAttribute("pos", ctrl_dir)
            this.DOM_root.append(ctrl)
        }
        this.DOM_root.style.cssText = `--box_x:${this.x}px; --box_y:${this.y}px; --box_z:${this.z}; --box_w:${this.width}px; --box_h:${this.height}px;`
        this.DOM_root.append(this.DOM_inner)
        this.DOM_root.setAttribute("pos", "C")


        this.md_flag = false
        this.tgt_pos = undefined
        this.DOM_root.addEventListener("mousedown", (e)=>{
            e.stopPropagation();
            e.preventDefault();
            this.md_flag=true;
            this.tgt_pos = e.target.getAttribute("pos");
        })
        this.DOM_root.addEventListener("mouseup", (e)=>{
            e.stopPropagation();
            e.preventDefault();
            this.md_flag=false;
            this.tgt_pos = undefined
        })
        // this.DOM_root.addEventListener("mouseleave", (e)=>{
        //     e.stopPropagation();
        //     e.preventDefault();
        //     this.md_flag=false;
        //     this.tgt_pos = undefined
        // })
        document.body.addEventListener("mousemove", (e)=>{this._repos_XY(e)})
        document.body.addEventListener("mouseup", (e)=>{
            if(this.md_flag){
                e.stopPropagation()
                e.preventDefault()
                this.md_flag = false
                this.tgt_pos = undefined
            }
        })

        return this
    }

    _repos_XY(event){
        if(!this.md_flag){
            return
        }
        event.stopPropagation();
        event.preventDefault();

        // @TODO: Change relative movement to recalulated movement
        // from starting position. movementX/Y may not be reliable
        // with fast flicks
        let dx = event.movementX
        let dy = event.movementY
        console.log(this.tgt_pos)
        switch (this.tgt_pos) {
            case "N E":
                // Only E
                this.width +=dx;
                // fall through to N
            case "N":
                // Increment Y, decrement height
                this.y +=dy;
                this.height -=dy;
                break;
            case "S W":
                // only W
                this.x +=dx;
                this.width -=dx;
                // fall through for S
            case "S":
                // change height
                this.height +=dy
                break;
            case "S E":
                // Only S, 
                this.height +=dy
                //fall through for E
            case "E":
                // change width
                this.width +=dx;
                break;
            case "N W":
                // Only N
                this.y +=dy;
                this.height -=dy;
                // fall through for W
            case "W":
                // increment X, decrement width
                this.x +=dx;
                this.width -=dx;
                break;
            
            default:
                // just move the whole thing
                this.x += dx
                this.y += dy
                break;
        }
        this.width = Math.max(0, this.width)
        this.height = Math.max(0, this.height)
        this.DOM_root.style.cssText = `--box_x:${this.x}px; --box_y:${this.y}px; --box_z:${this.z}; --box_w:${this.width}px; --box_h:${this.height}px;`
    }

    Render(){
        if(this.instance){
            return
        }
        this.instance = document.body.prepend(this.DOM_root)
    }

    Remove(){
        if(this.instance){
            this.instance.remove()
        }
    }
}

export { TransformBox }