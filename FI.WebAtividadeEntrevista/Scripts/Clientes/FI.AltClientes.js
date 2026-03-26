$(document).ready(function () {
    
    $('#CPF').mask('000.000.000-00');
    
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

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        var cpfSemMascara = $('#CPF').val().replace(/\D/g, '');
        
        var dataPost = {
            Id: obj ? obj.Id : 0,
            Nome: $(this).find("#Nome").val(),
            CEP: $(this).find("#CEP").val(),
            Email: $(this).find("#Email").val(),
            Sobrenome: $(this).find("#Sobrenome").val(),
            Nacionalidade: $(this).find("#Nacionalidade").val(),
            Estado: $(this).find("#Estado").val(),
            Cidade: $(this).find("#Cidade").val(),
            Logradouro: $(this).find("#Logradouro").val(),
            Telefone: $(this).find("#Telefone").val(),
            CPF: cpfSemMascara
        };

        $.ajax({
            url: urlPost,
            method: "POST",
            data: dataPost,
            success: function (r) {
                if (r.sucesso) {
                    ModalDialog("Sucesso!", r.mensagem);
                    $("#formCadastro")[0].reset();
                    
                    if (typeof urlRetorno !== "undefined" && urlRetorno)
                        window.location.href = urlRetorno;
                } else {
                    ModalDialog("Ocorreu um erro", r.mensagem);
                }
            },
            error: function (r) {
                var msg = "Erro desconhecido.";
                if (r.status === 400 && r.responseJSON)
                    msg = r.responseJSON.mensagem;
                else if (r.status === 500)
                    msg = "Ocorreu um erro interno no servidor.";

                ModalDialog("Ocorreu um erro", msg);
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