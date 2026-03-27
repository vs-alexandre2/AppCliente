$(document).on('click', '.btn-excluir', function () {

    var id = $(this).data('id');

    ModalConfirm("Confirmação", "Deseja realmente excluir este cliente?", function (confirmado) {

        if (!confirmado)
            return;

        $.ajax({
            url: urlExcluir,
            method: "POST",
            data: { id: id },
            success: function (r) {
                if (r.sucesso) {
                    ModalDialog("Sucesso!", r.mensagem);

                    $('#gridClientes').jtable('load');
                } else {
                    ModalDialog("Erro", r.mensagem);
                }
            },
            error: function (r) {
                var msg = "Erro ao excluir";

                if (r.responseJSON && r.responseJSON.mensagem)
                    msg = r.responseJSON.mensagem;

                ModalDialog("Erro", msg);
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

function ModalConfirm(titulo, texto, callback) {
    var random = Math.random().toString().replace('.', '');

    var html = '<div id="' + random + '" class="modal fade">\
        <div class="modal-dialog">\
            <div class="modal-content">\
                <div class="modal-header">\
                    <button type="button" class="close" data-dismiss="modal">&times;</button>\
                    <h4 class="modal-title">' + titulo + '</h4>\
                </div>\
                <div class="modal-body">\
                    <p>' + texto + '</p>\
                </div>\
                <div class="modal-footer">\
                    <button type="button" class="btn btn-default btn-nao">Não</button>\
                    <button type="button" class="btn btn-danger btn-sim">Sim</button>\
                </div>\
            </div>\
        </div>\
    </div>';

    $('body').append(html);

    var modal = $('#' + random);

    modal.modal('show');

    modal.find('.btn-sim').click(function () {
        callback(true);
        modal.modal('hide');
    });

    modal.find('.btn-nao').click(function () {
        callback(false);
        modal.modal('hide');
    });

    modal.on('hidden.bs.modal', function () {
        modal.remove();
    });
}