var conversationHistory = [];

var dados = {    
    "mensagem": conversationHistory
};
// sessionStorage.clear();


$(document).on("submit", "#form", function (e) {
    e.preventDefault();

    $('.btn_enviar').addClass('disabled').prop('disabled', true);

    // Obtém a mensagem do usuário   
    conversationHistory.push($("#pergunta").val());

    dados = {       
        "mensagem": conversationHistory
    };    

    // Cria um objeto para enviar ao servidor
    $.ajax({
        url: 'http://localhost:3000/gemini/',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dados), 
        success: function (data) {           
            conversationHistory.push(data);           

            $(".btn_enviar").removeClass('disabled').prop('disabled', false);

            // Atualiza a exibição com o histórico da conversa
            $("#resposta").text(conversationHistory.join('\n'));

            // Limpa o campo de entrada
            $("#pergunta").val('');
        },
        error: function (error) {
            // Lide com erros aqui
            $(".btn_enviar").removeClass('disabled').prop('disabled', false);
            console.error('Erro na requisição:', error);
        }
    });
});
