let clientes = [];


document.getElementById('openModalBtn').addEventListener('click', () => {
    document.getElementById('dataModal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('dataModal').style.display = 'none';
});


const showModal = (action, index = null) => {
    const dataModal = document.getElementById('dataModal');
    const modalTitle = document.getElementById('modalTitle');
    const clientIndexField = document.getElementById('clientIndex');
    const clienteForm = document.getElementById('clienteForm');

    if (action === 'edit' && index !== null) {
        const cliente = clientes[index];
        if (cliente) {
            document.getElementById('nome').value = cliente.nome || '';
            document.getElementById('data').value = cliente.data || '';
            document.getElementById('horario').value = cliente.horario || '';
            document.getElementById('telefone').value = cliente.telefone || '';
            document.getElementById('email').value = cliente.email || '';
            clientIndexField.value = index;
            modalTitle.textContent = 'Editar Cliente';
        } else {
            alert('Cliente não encontrado.');
        }
    } else {
        clienteForm.reset();
        clientIndexField.value = '';
        modalTitle.textContent = 'Adicionar Cliente';
    }
    dataModal.style.display = 'block';
};

window.deleteClient = (index) => {
    console.log(clientes)
    if (index >= 0 && index < clientes.length) {
        clientes.splice(index, 1);
        console.log("atualiaado", clientes)
        update();
    } else {
        alert('Cliente não encontrado.');
    }
};

const loadClientes = async () => {
    localStorage.clear()
    try {
        const response = await fetch('./clientes.json');
        const clientesJson = await response.json();

        const clientesLocalStorage = JSON.parse(localStorage.getItem('clientes')) || [];

        // Inicialize o array de clientes sem duplicação
        clientes = [...clientesJson, ...clientesLocalStorage];

        const numeroClientes = clientes.length;
        document.getElementById('numeroClientes').textContent = numeroClientes;

        const clientesDoMes = clientes.filter(cliente => {
            if (cliente && cliente.data) {
                const dataRegistro = new Date(cliente.data);
                const mesAtual = new Date().getMonth();
                const anoAtual = new Date().getFullYear();
                return dataRegistro.getMonth() === mesAtual && dataRegistro.getFullYear() === anoAtual;
            }
            return false;
        });

        const hoje = new Date();
        const proximoCliente = clientes
            .filter(cliente => cliente && cliente.data)
            .map(cliente => {
                const [ano, mes, dia] = cliente.data.split('-').map(Number);
                return {
                    ...cliente,
                    data: new Date(ano, mes - 1, dia)
                };
            })
            .filter(cliente => cliente.data > hoje) // Filtra datas no futuro
            .sort((a, b) => a.data - b.data) // Ordena por data
            .shift();

        if (proximoCliente) {
            document.getElementById('proximoCliente').textContent = proximoCliente.nome;
        } else {
            document.getElementById('proximoCliente').textContent = 'Nenhum cliente futuro encontrado.';
        }

        const numeroClientesDoMes = clientesDoMes.length;
        document.getElementById('numeroClientesDoMes').textContent = numeroClientesDoMes;

        const tableBody = document.querySelector('#clientesTable tbody');
        tableBody.innerHTML = '';

        clientes.forEach((cliente, index) => {
            if (cliente) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cliente.nome || ''}</td>
                    <td>${cliente.telefone || ''}</td>
                    <td>${cliente.email || ''}</td>
                    <td>${cliente.horario || ''}</td>
                    <td>${cliente.data || ''}</td>
                    <td style="text-align:center">
                        <button style="margin-right:15px;" onclick="showModal('edit', ${index})"><span class="material-symbols-outlined" style="font-size:1.1rem;">edit</span></button>
                        <button onclick="deleteClient(${index})"><span class="material-symbols-outlined" style="font-size:1.1rem;">delete</span></button>
                    </td>
                `;
                tableBody.appendChild(row);
            }
        });
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
    }
};




function update() {
    const numeroClientes = clientes.length;
    document.getElementById('numeroClientes').textContent = numeroClientes;

    const clientesDoMes = clientes.filter(cliente => {
        if (cliente && cliente.data) {
            const dataRegistro = new Date(cliente.data);
            const mesAtual = new Date().getMonth();
            const anoAtual = new Date().getFullYear();
            return dataRegistro.getMonth() === mesAtual && dataRegistro.getFullYear() === anoAtual;
        }
        return false;
    });

    const hoje = new Date();
    const proximoCliente = clientes
        .filter(cliente => cliente && cliente.data)
        .map(cliente => {
            const [ano, mes, dia] = cliente.data.split('-').map(Number);
            return {
                ...cliente,
                data: new Date(ano, mes - 1, dia)
            };
        })
        .filter(cliente => cliente.data > hoje) // Filtra datas no futuro
        .sort((a, b) => a.data - b.data) // Ordena por data
        .shift();

    if (proximoCliente) {
        document.getElementById('proximoCliente').textContent = proximoCliente.nome;
    } else {
        document.getElementById('proximoCliente').textContent = 'Nenhum cliente futuro encontrado.';
    }

    const numeroClientesDoMes = clientesDoMes.length;
    document.getElementById('numeroClientesDoMes').textContent = numeroClientesDoMes;

    const tableBody = document.querySelector('#clientesTable tbody');
    tableBody.innerHTML = '';

    clientes.forEach((cliente, index) => {
        if (cliente) {
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${cliente.nome || ''}</td>
                    <td>${cliente.telefone || ''}</td>
                    <td>${cliente.email || ''}</td>
                    <td>${cliente.horario || ''}</td>
                    <td>${cliente.data || ''}</td>
                    <td style="text-align:center">
                        <button style="margin-right:15px;" onclick="showModal('edit', ${index})"><span class="material-symbols-outlined" style="font-size:1.1rem;">edit</span></button>
                        <button onclick="deleteClient(${index})"><span class="material-symbols-outlined" style="font-size:1.1rem;">delete</span></button>
                    </td>
                `;
            tableBody.appendChild(row);
        }
    });
}




document.addEventListener('DOMContentLoaded', loadClientes);

document.getElementById('clienteForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const cliente = {
        nome: document.getElementById('nome').value,
        horario: document.getElementById('horario').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        data: document.getElementById('data').value
    };

    const index = document.getElementById('clientIndex').value;

    if (index !== '') {
        clientes[index] = cliente;
    } else {
        clientes.push(cliente);
    }

    localStorage.setItem('clientes', JSON.stringify(clientes));
    update();
    document.getElementById('dataModal').style.display = 'none';
});