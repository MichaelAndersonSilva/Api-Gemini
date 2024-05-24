var conversationHistory = [];

var dados = {
    "mensagem": conversationHistory,
};
$(function () {
    $("#pergunta").focus();
});

$(document).on("submit", "#form", function (e) {
    e.preventDefault();

    $('.btn_enviar').addClass('disabled').prop('disabled', true);

    // Obtém a mensagem do usuário   
    conversationHistory.push($("#pergunta").val());

    if ($("#resposta").val().length > 0) {
        $("#resposta").append('\n\n');
    }
    $("#resposta").append('Usuário: ' + $("#pergunta").val() + '\n');
    $("#resposta").scrollTop($("#resposta")[0].scrollHeight);


    dados = {
        "mensagem": conversationHistory,
        "personagem": $("#personagem").val(),
        "characterLimit": $("#characterLimit").val(),
        "lenguageResponse": $("#lenguageResponse").val(),
        "temperature": parseInt($("#temperature").val()) / 100
        // "model_name" : $("#model_name").val()
    };

    $("#spinner").addClass('spinner-border')
    // Cria um objeto para enviar ao servidor
    $.ajax({
        url: 'http://localhost:3000/gemini/',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dados),
        success: function (data) {
            // Limpa o campo de entrada
            $("#pergunta").val('');

            conversationHistory.push(data);
            $(".btn_enviar").removeClass('disabled').prop('disabled', false);

            for (let i = 0; i < data.length; i++) {
                setTimeout(function () {
                    $("#resposta").append(data[i]);
                    $("#resposta").scrollTop($("#resposta")[0].scrollHeight);
                }, 20 * i)
            }

            $("#resposta").scrollTop($("#resposta")[0].scrollHeight);
            $("#resposta").append('\n*************************************\n\n');
            $("#spinner").removeClass('spinner-border')
        },
        error: function (error) {
            // Lide com erros aqui
            $("#resposta").val('Erro na requisição:', error)
            $(".btn_enviar").removeClass('disabled').prop('disabled', false);
            $("#spinner").removeClass('spinner-border')
            console.error('Erro na requisição:', error);
        }
    });
});