
document.addEventListener("DOMContentLoaded", function() {
    const buttonForm = document.querySelector('.buttonForm');
    const buttonModal = document.querySelector('.buttonModal');
    const formModal = document.querySelector('.formModal');
    
    buttonForm.addEventListener('click', function(e) {
        if(formModal.style.display === 'none') {
            formModal.style.display = 'flex';
        } else {
            formModal.style.display = 'none';
        }
    })

    buttonModal.addEventListener('click', function(e) {
        formModal.style.display = 'none';
    })


    let data = {};
    fetch('arbol.json')
        .then(response => response.json())
        .then(json => {
            data = json;
            const container = document.getElementById('jsontree');
            container.appendChild(createTree(data.mensaje));

            const toggler = document.getElementsByClassName("caret");
            for (let i = 0; i < toggler.length; i++) {
                toggler[i].addEventListener("click", function() {
                    this.parentElement.querySelector(".nested").classList.toggle("active");
                    this.classList.toggle("caretdown");
                });
            }
        })
        .catch(error => console.error('Error loading the JSON:', error));

    document.getElementById('categoryForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('categoryTitle').value;
        const parentId = document.getElementById('parentCategory').value;

        const newCategory = {
            "Id": generateId(),
            "IdItem": generateId(),
            "IdParent": parentId || "0",
            "Titulo": title,
            "Tipo": "C",
            "Estado": "A",
            "Registro": new Date().toISOString(),
            "node": []
        };

        addNode(data.mensaje, newCategory);
        updateTree();
    });

    document.getElementById('articleForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('articleTitle').value;
        const parentId = document.getElementById('parentCategoryArticle').value;

        const newArticle = {
            "Id": generateId(),
            "IdItem": generateId(),
            "IdParent": parentId,
            "Titulo": title,
            "Tipo": "A",
            "Estado": "A",
            "Registro": new Date().toISOString()
        };

        addNode(data.mensaje, newArticle);
        updateTree();
    });

    function generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function addNode(nodes, newNode) {
        for (let node of nodes) {
            if (node.Id === newNode.IdParent) {
                if (!node.node) {
                    node.node = [];
                }
                node.node.push(newNode);
                return;
            } else if (node.node && node.node.length > 0) {
                addNode(node.node, newNode);
            }
        }
    }

    function updateTree() {
        const container = document.getElementById('jsontree');
        container.innerHTML = '';
        container.appendChild(createTree(data.mensaje));

        const toggler = document.getElementsByClassName("caret");
        for (let i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function() {
                this.parentElement.querySelector(".nested").classList.toggle("active");
                this.classList.toggle("caretdown");
            });
        }
    }

    function createTree(nodes) {
        const ul = document.createElement('ul');
        nodes.forEach(node => {
            const li = document.createElement('li');
            
            if (node.Tipo === "C") {
                const span = document.createElement('span');
                span.className = 'caret category';
                span.textContent = node.Titulo;
                li.appendChild(span);
                
                if (node.node && node.node.length > 0) {
                    const nestedUl = createTree(node.node);
                    nestedUl.className = 'nested';
                    li.appendChild(nestedUl);
                }
            } else if (node.Tipo === "A") {
                li.className = 'article';
                li.textContent = node.Titulo;
            }

            ul.appendChild(li);
        });
        return ul;
    }
});
