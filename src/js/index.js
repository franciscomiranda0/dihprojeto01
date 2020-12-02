document.body.onload = () => buildTable()

const buildTable = () => {
    document
        .querySelector('tbody')
        .innerHTML = getTableHead()
    for (i = 0; i < localStorage.length; i++) {
        const itemKey = localStorage.key(i)
        const element = getTableRow(localStorage.getItem(itemKey), i);
        document.querySelector('tbody').appendChild(element)
    }
}

const clearStorage = () => {
    localStorage.clear()
    buildTable()
}

const deleteListItem = (itemId) => {
    confirm('Deseja mesmo excluir?') ?
        localStorage.removeItem(itemId) :
        null
    buildTable()
}

function getNewItemId() {
    let newId
    do {
        newId = (Math.random() * (10000 - 1000) + 1000).toFixed().toString()
    } while (!isNewIdAvailable(newId))
    return newId
}

const isNewIdAvailable = (newId) => {
    return localStorage.getItem(newId) == null
}

const getTableHead = () =>
    `<tr class="table__head">
        <th class="table__small">#</th>
        <th class="table__small">ID</th>
        <th class="table__medium">Estado</th>
        <th class="table__large">Descrição</th>
        <th class="table__medium" colspan="2">Opções</th>
    </tr>`

const getTableRow = (listItem, index) => {
    const element = document.createElement('tr')
    const item = JSON.parse(listItem)
    element.innerHTML =
        `<tr>
            <td class="table__small">${++index}</td>
            <td class="table__small">${item.itemId}</td>
            <td>
            <label class="container">
            
                <input type="checkbox"
                    id="${item.itemId}"
                    value="${item.itemId}"
                    ${item.itemDone ? 'checked' : ''}
                    onchange="updateListItem(value, 'CHECKBOX')">
                    <span class="checkmark" for="${item.itemId}"></span>
                    <div>
                        ${item.itemDone ? 'DONE' : 'TODO'}                
                    </div>
            </label>
                
            </td>
            <td style="${item.itemDone ? 'text-decoration: line-through': 'none'  }">${item.itemDescription}</td>
            <td>
                <button class="btn__base btn__option" value="${item.itemId}" onclick="updateListItem(value, 'DESCRIPTION')">
                    &#9998;
                </button>
            </td>
            <td>
                <button class="btn__base btn__option" value="${item.itemId}" onclick="deleteListItem(value)" >
                    &#9851;
                </button>
            </td>
        </tr>`
    return element
}

const saveListItem = (listItem) => {
    localStorage.setItem(listItem.itemId, JSON.stringify(listItem))
    buildTable()
}

const setNewListItem = (description) => new Object({
    itemId: getNewItemId(),
    itemDescription: description,
    itemDone: false
})

const submitForm = (event) => {
    event.preventDefault()
    const inputValue = event.target[0].value
    if (inputValue == '') return
    saveListItem(setNewListItem(inputValue))
    document.getElementById('descriptionInput').value = ''
}

const updateListItem = (itemId, updateType) => {
    const item = JSON.parse(localStorage.getItem(itemId))
    const descriptionMemory = item.itemDescription
    do {
        updateType === 'DESCRIPTION' ?
            item.itemDescription = prompt('Nova descrição:') :
            item.itemDone = !item.itemDone
        item.itemDescription == null ?
            item.itemDescription = descriptionMemory :
            null
    } while (item.itemDescription == '')
    saveListItem(item)
}