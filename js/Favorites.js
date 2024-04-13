import { GithubUser } from "./GithubUser.js"

class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error(`User already favorited!`)
            }

            const user = await GithubUser.search(username)
            
            if(user.login === undefined) {
                throw new Error(`User not found!`)
            }
            
            this.entries = [user, ...this.entries]
            this.save()
            this.update()
            
        } catch (Error) {
            alert(Error.message)
        }

    }

    save() {
        localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.save()
        this.update()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        
        this.tbody = this.root.querySelector("table tbody")
        this.onAdd()
        this.update()
    }

    update() {
        this.removeAllRow()

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector(".user img").src = `https://github.com/${user.login}.png`
            row.querySelector(".user img").alt = `imagem de ${user.name}`
            row.querySelector(".user a").href = `https://github.com/${user.login}`
            row.querySelector(".user p").textContent = user.name
            row.querySelector(".user span").textContent = user.login
            row.querySelector(".repositories").textContent = user.public_repos
            row.querySelector(".followers").textContent = user.followers

            row.querySelector(".remove").onclick = () => {
                const isOk = confirm(`Do you really want to remove ${user.login}?`)

                if(isOk) {
                    this.delete(user)
                }

            }

            this.tbody.append(row)
        })
    }

    onAdd() {
        const addButton = this.root.querySelector(".search button")
        addButton.onclick = () => {
            const { value } = this.root.querySelector(".search input")
            
            this.add(value)

        }

    }

    createRow() {
        const tr = document.createElement("tr")
        tr.innerHTML = `
        <td class="user">
            <img src="" alt="">
            <a href="" target="_blank">
                <p></p>
                <span></span>
            </a>
        </td>
        <td class="repositories"></td>
        <td class="followers"></td>
        <td>
            <button class="remove">&times;</button>
        </td>
        `
        return tr
    }

    removeAllRow() {
        this.tbody.querySelectorAll("tr").forEach(tr => {
            tr.remove()
        })
    }
}
