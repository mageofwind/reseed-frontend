import SecureLS from "secure-ls";

const getStorage = (name: string) => new SecureLS().get(name)

const addStorage = (name: string, data: JSON) => new SecureLS().set(name, data)

const removeStorage = (name: string) => new SecureLS().remove(name)

const ls = {
    getStorage, addStorage, removeStorage
}
export default ls