$(document).ready(function () {
    
    $('#CPF').mask('000.000.000-00');

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        var cpfSemMascara = $('#CPF').val().replace(/\D/g, '');

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "Nome": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": cpfSemMascara
            },
            success: function (r) {
                if (r.sucesso) {
                    ModalDialog("Sucesso!", r.mensagem);
                    $("#formCadastro")[0].reset();
                } else {
                    ModalDialog("Ocorreu um erro", r.mensagem);
                }
            },
            error: function (r) {
                if (r.status === 400) {
                    var msg = r.responseJSON ? r.responseJSON.mensagem : "Erro desconhecido.";
                    ModalDialog("Ocorreu um erro", msg);
                } else if (r.status === 500) {
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                } else {
                    ModalDialog("Ocorreu um erro", "Erro desconhecido.");
                }
            }
        });
    });
});

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