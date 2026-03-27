var beneficiarios = [];

$(document).ready(function () {

    $('#CPF').mask('000.000.000-00');
    $('#benefCPF').mask('000.000.000-00');

    $('#btnBeneficiarios').click(function () {
        $('#modalBeneficiarios').modal('show');
    });

    $('#btnAddBenef').click(function () {

        var nome = $('#benefNome').val();
        var cpf = $('#benefCPF').val().replace(/\D/g, '');

        if (!nome || !cpf) {
            ModalDialog("Atenção", "Preencha Nome e CPF");
            return;
        }

        if (beneficiarios.some(b => b.CPF === cpf)) {
            ModalDialog("Atenção", "CPF já adicionado");
            return;
        }

        beneficiarios.push({
            Nome: nome,
            CPF: cpf
        });

        renderTabela();

        $('#benefNome').val('');
        $('#benefCPF').val('');
    });

    function renderTabela() {
        var tbody = $('#listaBenef tbody');
        tbody.empty();

        beneficiarios.forEach(function (b, index) {
            var cpfFormatado = b.CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

            var btnAlterar = `<button type="button" class="btn btn-sm btn-primary btn-alterar" data-index="${index}">Alterar</button>`;
            var btnExcluir = `<button type="button" class="btn btn-sm btn-primary btn-excluir" data-index="${index}">Excluir</button>`;

            tbody.append(`<tr>
            <td>${b.Nome}</td>
            <td>${cpfFormatado}</td>
            <td>${btnAlterar} ${btnExcluir}</td>
        </tr>`);
        });
       
        $('.btn-excluir').off('click').on('click', function () {
            var idx = $(this).data('index');
            beneficiarios.splice(idx, 1);
            renderTabela();
        });
       
        $('.btn-alterar').off('click').on('click', function () {
            var idx = $(this).data('index');
            var b = beneficiarios[idx];

            $('#benefNome').val(b.Nome);
            $('#benefCPF').val(b.CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"));

            beneficiarios.splice(idx, 1);
            renderTabela();
        });
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        var cpfSemMascara = $('#CPF').val().replace(/\D/g, '');

        $.ajax({
            url: urlPost,
            method: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                Nome: $("#Nome").val(),
                CEP: $("#CEP").val(),
                Email: $("#Email").val(),
                Sobrenome: $("#Sobrenome").val(),
                Nacionalidade: $("#Nacionalidade").val(),
                Estado: $("#Estado").val(),
                Cidade: $("#Cidade").val(),
                Logradouro: $("#Logradouro").val(),
                Telefone: $("#Telefone").val(),
                CPF: cpfSemMascara,
                Beneficiarios: beneficiarios
            }),
            success: function (r) {
                if (r.sucesso) {
                    ModalDialog("Sucesso!", r.mensagem);
                    $("#formCadastro")[0].reset();
                    beneficiarios = [];
                    renderTabela();
                } else {
                    ModalDialog("Erro", r.mensagem);
                }
            },
            error: function (r) {
                var mensagem = r.responseJSON?.mensagem || "Ocorreu um erro inesperado";
                ModalDialog("Erro", mensagem);

                console.log(r.responseText);
            }
        });
    });
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var html = '<div id="' + random + '" class="modal fade">\
        <div class="modal-dialog">\
            <div class="modal-content">\
                <div class="modal-header">\
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
                    <h4 class="modal-title">' + titulo + '</h4>\
                </div>\
                <div class="modal-body">\
                    <p>' + texto + '</p>\
                </div>\
                <div class="modal-footer">\
                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>\
                </div>\
            </div>\
        </div>\
    </div>';

    $('body').append(html);
    $('#' + random).modal('show');
}