const dateMask = (date)=>date.replace(/\D/g, '')
.replace(/^(\d)/, '$1')
.replace(/^(\/\d{2})(\d)/, '$1/$2')
.replace(/^(\d{2})(\d{4})/, '$1/$2')
.replace(/(\/\d{4})\d+?$/, '$1')


class TimeLine {
    // Contrutor da classe
    constructor(elementTarget) {
        this.events = []
        this.elementTarget = document.querySelector(elementTarget)
        if (localStorage.hasOwnProperty('events')) { // caso exista um localstorage ele carrega as informações
            this.loadStorage()
        }
    }
    // Função para garantir que o array sempre esteja em ordem ASC das datas
    sortByDate() {
        this.events = this.events.sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return dateA < dateB ? -1 : dateA > dateB ? 1 : 0
        })

        this.events.forEach((e, i) => {
            e['id'] = i
        })
    }
    // Atualiza o localstorage
    updateStorage() {
        this.sortByDate()
        localStorage.setItem('events', JSON.stringify(this.events))
        this.chargeData()
    }
    // carrega as infomações do localstorage
    loadStorage() {
        this.setEvents(JSON.parse(localStorage.getItem('events')))
        this.chargeData()
    }
    getEvent(id) {
        this.events.forEach(event => {
            if (event['id'] == id) return event
        })
        return null
    }

    setEvent(id, event) {
        this.events[id] = event
        this.updateStorage()
    }

    getEvents() {
        return this.events
    }

    setEvents(events) {
        this.events = events
        this.updateStorage()
    }
    // Adiciona um evento novo
    addEvent(event) {
        this.events.push(event)
        this.updateStorage()
    }
    // Remove um evento
    removeEvent(id) {
        this.events.splice(parseInt(id), 1)
        this.updateStorage()
    }
    // Monta o layout da listagem de eventos
    render(id, date, description) {
        return `
        <li class="event" id="event-${id}" >
            <div class="header" data-id="${id}">
                <b class="edit-date" data-id="${id}" contenteditable="false">${date}</b>
                <div class="icons">
                    <span data-edit="${id}" class="icon edit"><svg version="1.1" fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve"><g><g><path d="M510.18,103.991c-4.599-22.996-17.676-46.203-36.821-65.349c-19.145-19.146-42.354-32.221-65.35-36.821 c-25.206-5.043-47.381,0.471-62.434,15.523l-319.9,319.901L0,512.001l174.755-25.675l319.901-319.9 C509.708,151.373,515.222,129.2,510.18,103.991z M356.224,49.291l21.298,21.297L82.444,365.666l-21.297-21.297L356.224,49.291z M398.819,91.885l21.297,21.297L125.038,408.26l-21.297-21.297L398.819,91.885z M73.896,470.702l-32.596-32.597l9.094-61.897 l85.4,85.4L73.896,470.702z M167.633,450.855l-21.298-21.298l295.078-295.078l21.298,21.298L167.633,450.855z M480.833,131.305 L380.694,31.167c19.763-4.771,48.695,6.1,71.367,28.772C474.734,82.611,485.605,111.544,480.833,131.305z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></span>
                    <span data-remove="${id}" class="icon remove"><svg enable-background="new 0 0 100 100" fill="currentColor" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="m67.819458 49.9814415 25.9867172-25.9867153c4.9003525-4.9003544 4.9003525-12.9191027 0-17.819458-4.9003601-4.9003563-12.9191055-4.9003563-17.8194656 0l-25.9867096 25.9867115-25.9867115-25.9867125c-4.9003563-4.9003563-12.9191046-4.9003563-17.8194618 0s-4.9003563 12.9191046 0 17.819458l25.9867096 25.9867153-25.9867087 25.9867144c-4.9003563 4.9003296-4.9003563 12.9191208 0 17.819458 2.5244189 2.5244446 5.6428337 3.7123871 8.90973 3.7123871s6.5337925-1.1879425 8.9097309-3.7123871l25.9867115-25.9867096 25.9867096 25.9867096c2.5244217 2.5244446 5.6428375 3.7123871 8.909729 3.7123871 3.2668991 0 6.5338058-1.1879425 8.9097366-3.7123871 4.9003525-4.9003372 4.9003525-12.9191284 0-17.819458z"/></svg></span>
                </div>
            </div>
            <div class="body">
                 <p data-id="${id}" class="edit-desc" contenteditable="false">${description}</p>
            </div>
        </li>`
    }
    // Carrega a função para habilitar a remoção de um evento no front
    loadFunctionRemove() {
        const removeEvents = document.querySelectorAll('.remove')
        if (removeEvents) removeEvents.forEach(removeEvent => {
            removeEvent.addEventListener('click', e => {
                e.preventDefault()
                const id = removeEvent.getAttribute('data-remove')
                this.removeEvent(id)
            })
        })
        
    }
    // Carrega a função para habilitar a edição de um evento no front
    loadFunctionEdit() {
        const editEvents = document.querySelectorAll('.edit')
        if (editEvents) editEvents.forEach(editEvent => {
            editEvent.addEventListener('click', e => {
                e.preventDefault()
                
                const id = editEvent.getAttribute('data-edit')
                const parent = document.querySelector(`#event-${id}`)
                if (parent) {
                    const editables = parent.querySelectorAll('[contenteditable]')
                    if (editables) editables.forEach(el=> {
                        el.setAttribute('contenteditable','true')
                        if (el.classList.contains('edit-date')) {
                            let newStr = ''
                            el.addEventListener('input',e=>{
                                e.preventDefault()
                                if (el.textContent.length < 9) {
                                    el.textContent = el.textContent.replace(/\D/g, '')
                                    if (el.textContent.length > 7) {
                                        const aux = el.textContent.split('')
                                        let str = ''
                                        //str = `${aux[0]}${aux[1]}/${aux[2]}${aux[3]}/${aux[4]}${aux[5]}${aux[6]}${aux[7]}`
                                        str = `${aux.slice(0,2).join('')}/${aux.slice(2,4).join('')}/${aux.slice(4).join('')}`
                                        el.textContent = str
                                        newStr = str
                                    }
                                } else {
                                    el.textContent = newStr
                                }
                            })
                        }
                    })
                    if (!parent.querySelector('.save')) {
                        parent.insertAdjacentHTML('beforeend','<button class="save">Salvar</button>')
                        parent.insertAdjacentHTML('afterbegin','<p>Edite seu evento</p>')
                    }
                    parent.classList.add('editable')
                    const btnSave = parent.querySelector('.save')
                    if (btnSave) btnSave.addEventListener('click',e=>{
                        e.preventDefault()
                        const date = new Date(parent.querySelector('.edit-date').textContent.split('/').reverse().join('-'))
                        const description = parent.querySelector('.edit-desc').textContent
                        const newEvent = {
                            id: id,
                            date: date,
                            description: description,
                        }
                        this.setEvent(id, newEvent)
                    })
                }
            })
        })
    }
    // Carrega todas as infos pertinentes ao eventos e chama a render para montar o layout 
    chargeData() {
        this.elementTarget.innerHTML = ''
        this.sortByDate()
        this.events.forEach((el) => {
            const date = new Date(el['date']).toLocaleDateString('pt-Br', { timeZone: 'UTC' })
            const id = el['id']
            const description = el['description']
            this.elementTarget.insertAdjacentHTML('beforeend', this.render(id, date, description))
        })
        this.loadFunctionRemove()
        this.loadFunctionEdit()
    }

}

// inicializa a instancia da timeline
const timeline = new TimeLine('#events')

// Seta o botão para adicionar um evendo na lista, deixando o código limpo e dinâmico
const addEvent = document.querySelector('.add')
if (addEvent) addEvent.addEventListener('click',e=>{
    e.preventDefault()
    timeline.addEvent({date:0})
    const dataId = document.querySelector('[data-id="0"]')
    if (dataId) dataId.querySelector('.edit').click()
})

