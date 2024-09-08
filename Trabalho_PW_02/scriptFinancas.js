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
            document.getElementById('funcionario').value = cliente.Funcionário || '';
            document.getElementById('tipo').value = cliente.tipo || '';
            document.getElementById('descricao').value = cliente.Descrição || '';
            document.getElementById('horario').value = cliente.horario || '';
            document.getElementById('valor').value = cliente.valor || '';
            document.getElementById('data').value = cliente.data || '';
            clientIndexField.value = index;
            modalTitle.textContent = 'Editar Conta';
        } else {
            alert('Conta não encontrada.');
        }
    } else {
        clienteForm.reset();
        clientIndexField.value = '';
        modalTitle.textContent = 'Adicionar Conta';
    }
    dataModal.style.display = 'block';
};

// Adiciona a função ao evento de submit do formulário
document.getElementById('clienteForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const cliente = {
        Funcionário: document.getElementById('funcionario').value,
        tipo: document.getElementById('tipo').value,
        Descrição: document.getElementById('descricao').value,
        horario: document.getElementById('horario').value,
        valor: parseFloat(document.getElementById('valor').value) || 0,
        data: document.getElementById('data').value
    };

    const index = document.getElementById('clientIndex').value;

    if (index !== '') {
        // Edita o cliente existente
        clientes[index] = cliente;
    } else {
        // Adiciona um novo cliente
        clientes.push(cliente);
    }

    localStorage.setItem('clientes', JSON.stringify(clientes));
    update();
    document.getElementById('dataModal').style.display = 'none';
});


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
    try {
        const response = await fetch('./financas.json');
        const clientesJson = await response.json();

        const clientesLocalStorage = JSON.parse(localStorage.getItem('financas')) || [];

        clientes = [...clientesJson, ...clientesLocalStorage];

        calcularSaldos();


        const tableBody = document.querySelector('#clientesTable tbody');
        tableBody.innerHTML = '';

        clientes.forEach((cliente, index) => {
            if (cliente) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cliente.Funcionário || ''}</td>
                    <td>${cliente.tipo || ''}</td>
                    <td>${cliente.Descrição || ''}</td>
                    <td>${cliente.data || ''}</td>
                    <td>${cliente.horario || ''}</td>
                    <td>${cliente.valor || ''}</td>
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



const calcularSaldos = () => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    // Filtra contas do mês atual
    const contasDoMes = clientes.filter(cliente => {
        const dataConta = new Date(cliente.data);
        return dataConta.getMonth() === mesAtual && dataConta.getFullYear() === anoAtual;
    });

    const saldoMes = contasDoMes.reduce((total, cliente) => {
        const valor = parseFloat(cliente.valor) || 0;
        return cliente.tipo === 'Gasto' ? total - valor : (cliente.tipo === 'Depósito' ? total + valor : total);
    }, 0);

    const saldoTotal = clientes.reduce((total, cliente) => {
        const valor = parseFloat(cliente.valor) || 0;
        return cliente.tipo === 'Gasto' ? total - valor : (cliente.tipo === 'Depósito' ? total + valor : total);
    }, 0);

    const quantidadeContasDoMes = contasDoMes.length;

    document.getElementById('saldoMes').textContent = `R$ ${saldoMes.toFixed(2)}`;
    document.getElementById('saldoTotal').textContent = `R$ ${saldoTotal.toFixed(2)}`;
    document.getElementById('quantidadeContasDoMes').textContent = `${quantidadeContasDoMes}`;
};


function update() {
    const tableBody = document.querySelector('#clientesTable tbody');
    tableBody.innerHTML = '';


    calcularSaldos();

    clientes.forEach((cliente, index) => {
        if (cliente) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.Funcionário || ''}</td>
                <td>${cliente.tipo || ''}</td>
                <td>${cliente.Descrição || ''}</td>
                <td>${cliente.data || ''}</td>
                <td>${cliente.horario || ''}</td>
                <td>${cliente.valor || ''}</td>
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