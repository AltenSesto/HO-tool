export default interface Connection {
    id: string,
    source: string,
    target: string,
    label?: string,
    isOriented: boolean
}
