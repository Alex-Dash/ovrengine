const ghex = n=>[...Array(n)].map(()=>Math.floor(Math.random()*16).toString(16)).join('');
const hexset = new Set("0123456789abcdef")

/**
 * Reformats or regenerates input hexadecimal string.
 * If the string cannot be reformatted to hex, it gets
 * regenerated with the supplied length.
 * 
 * @param {string} input - Input hexadecimal string
 * @param {number} length - Expected length (Dashes are ignored)
 * @returns {string} Reformatted or regenerated string
 */
function hexReformat(input, length) {
    if(typeof input !== "string"){
        return ghex(length)
    }

    let t = input.toLowerCase().trim().replaceAll("-","")

    if(t.length !== length || !new Set(t).isSubsetOf(hexset)){
        return ghex(length)
    }

    return t
}

/**
 * Generates a UUID v4 string from individual components
 * in the following format:
 * 
 * aaaaaaaa-aaaa-Mbbb-Nccc-cccccccccccc
 *
 * Dashes (`-`) in components would be ignored
 * 
 * All non-compliant or absent components would be regenerated 
 * randomly
 * @param {string} a Hexadecimal a component (dashes are stripped)
 * @param {string} b Hexadecimal b component
 * @param {string} c Hexadecimal c component (dashes are stripped)
 * @returns {string} UUID v4 string
 */
function UUIDv4(a,b,c) {
    const M = "4"
    const N = "a"
    let a_ch = hexReformat(a, 12)
    a_ch = `${a_ch.substring(0,8)}-${a_ch.substring(8)}`
    let b_ch = hexReformat(b, 3)
    let c_ch = hexReformat(c, 15)
    c_ch = `${c_ch.substring(0,3)}-${c_ch.substring(3)}`

    return `${a_ch}-${M}${b_ch}-${N}${c_ch}`
}

export { UUIDv4 }