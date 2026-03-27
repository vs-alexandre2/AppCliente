var beneficiarios = obj && obj.Beneficiarios ? obj.Beneficiarios : [];
var indexEdicao = null;

$(document).ready(function () {

    $('#CPF').mask('000.000.000-00');
    $('#benefCPF').mask('000.000.000-00');

    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);

        if (obj.CPF) {
            var cpfFormatado = obj.CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            $('#formCadastro #CPF').val(cpfFormatado);
        }
    }

    $('#btnBeneficiarios').click(function () {
        renderTabela();
        $('#modalBeneficiarios').modal('show');
    });

    $('#btnAddBenef').click(function () {
        var nome = $('#benefNome').val();
        var cpf = $('#benefCPF').val().replace(/\D/g, '');

        if (!nome || !cpf) {
            ModalDialog("Atenção", "Preencha Nome e CPF");
            return;
        }

        var existe = beneficiarios.some((b, i) => b.CPF === cpf && i !== indexEdicao);

        if (existe) {
            ModalDialog("Atenção", "CPF já adicionado");
            return;
        }

        if (indexEdicao !== null) {            
            beneficiarios[indexEdicao].Nome = nome;
            beneficiarios[indexEdicao].CPF = cpf;
        } else {            
            beneficiarios.push({
                Id: 0,
                Nome: nome,
                CPF: cpf
            });
        }

        limparCamposBenef();
        renderTabela();
    });

    function limparCamposBenef() {
        $('#benefNome').val('');
        $('#benefCPF').val('');
        indexEdicao = null;
    }

    function renderTabela() {
        var tbody = $('#listaBenef tbody');
        tbody.empty();

        beneficiarios.forEach(function (b, index) {
            var cpfFormatado = b.CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");           

            var btnAlterar = `<button type="button" class="btn btn-sm btn-primary btn-alterar" data-index="${index}">Alterar</button>`;
            var btnExcluir = `<button type="button" class="btn btn-sm btn-primary btn-excluir" data-index="${index}">Excluir</button>`;

            tbody.append(`<tr>
                <td>${cpfFormatado}</td>
                <td>${b.Nome}</td>                
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

            indexEdicao = idx;
        });
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        var cpfSemMascara = $('#CPF').val().replace(/\D/g, '');

        var dataPost = {
            Id: obj ? obj.Id : 0,
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
        };

        $.ajax({
            url: urlPost,
            method: "POST",
            data: dataPost,
            success: function (r) {
                if (r.sucesso) {
                    ModalDialog("Sucesso!", r.mensagem);
                    $("#formCadastro")[0].reset();
                    beneficiarios = [];

                    if (typeof urlRetorno !== "undefined" && urlRetorno)
                        window.location.href = urlRetorno;
                } else {
                    ModalDialog("Erro", r.mensagem);
                }
            },
            error: function (r) {
                var msg = "Erro desconhecido.";
                if (r.status === 400 && r.responseJSON)
                    msg = r.responseJSON.mensagem;
                else if (r.status === 500)
                    msg = "Erro interno no servidor";

                ModalDialog("Erro", msg);
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