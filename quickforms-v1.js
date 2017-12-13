
document.addEventListener("DOMContentLoaded", function (e) {
    
    $('form').click(function(){
        var current_form = $(this);
        verifyFormAttributes(current_form);    
       // event.preventDefault();
    });
    
    addEncodingDefaultFORM();
    $('.form').submit(function (event) {
        event.preventDefault();
        var current_form = $(this);   
        var formdata =  formattingData(current_form);                                              
        sendAJAX(current_form, formdata);  
    });
});  

var mensagem = {};
mensagem.send = {
    error: "Erro ao enviar mensagem!",
    success: "Mensagem enviada com sucesso!"
};
mensagem.subscribe = {
    error: "Erro ao realizar cadastro em newsletter!",
    success: "Cadastro realizado com sucesso no newsletter!"
};


function addEncodingDefaultFORM(){
     $('.form').attr('enctype','multipart/form-data');
}

function verifyFormAttributes(current_form) {
    var method = $(current_form).attr('method');
    var action = $(current_form).attr('action');
    var class_form = $(current_form).attr('class').split(' ');
    var button = $(current_form).find('[type=submit]')[0];
    var all_warnings = '';
    var located = '';
    
    if (method != 'POST' && method != 'post') {
        all_warnings += 'Metodo do formulario deve ser <b>POST</b>. <br>';
    }

    if (action === undefined || action === '' ||
            action === null || action === ' ') {
        all_warnings += 'Voce deve informar endereço pra aonde será enviado dados via ajax. <br>';
    }

    if (button === undefined) {
        all_warnings += 'No formulário deve existir um botão do tipo <b>submit</b> <br>';
    }

    $(class_form).each(function (index, value) {
        if (value == 'form') {
            located = 'located';
        }
    });

    if (located != 'located') {
        all_warnings += 'Você deve inserir a class <b>form</b> no seu formulario';
    }

    var response_html = '<div class="clearfix"></div><div class="alert alert-warning" \n\
                            role="alert"><b>Atenção!</b> <br><br> ' + all_warnings + '</div>';
        
    if(all_warnings != ''){
        $(current_form).find('.alert-warning').remove();
        addHTML(response_html, current_form);
    }
}

function formattingData(current_form) {
    var formdata = new FormData();
    formdata.append("dados", JSON.stringify($(current_form).serializeArray()));
    if (typeof $(current_form).find('[type=file]').attr('type') !== 'undefined') {
        formdata.append("input-file", $(current_form).find('[type=file]').prop("files")[0]);
    }
        return formdata;
}

function checkData(current_form) {
       
    if ($(current_form).data('type') === 'send') {
        var msgSuccessDefault = mensagem.send.success;
        var msgErrorDefault = mensagem.send.error;
    }

    if ($(current_form).data('type') === 'subscribe') {
        var msgSuccessDefault = mensagem.subscribe.success;
        var msgErrorDefault = mensagem.subscribe.error;
    }
    
    if ($(current_form).data('type') === "" || $(current_form).data('type') === false || $(current_form).data('type') === undefined) {
        var msgSuccessDefault = mensagem.send.success;
        var msgErrorDefault = mensagem.send.error;
    }
    var msgSuccess = $(current_form).data('message-success');
    var msgError = $(current_form).data('message-error');

    if (msgSuccess === "" || msgSuccess === undefined || msgSuccess === false) {
        msgSuccess = msgSuccessDefault;       
    }
    
    if (msgError === "" || msgError === undefined || msgError === false) {
        msgError = msgErrorDefault;       
    }   

    return {
        success:'<div class="clearfix"></div><div class="alert alert-success" role="alert">'+ msgSuccess +'</div>',
        
        error:'<div class="clearfix"></div><div class="alert alert-danger" role="alert"> '+msgError+'</div>',
        
        warning:'<div class="clearfix"></div><div class="alert alert-warning" role="alert"> Endereço de envio de e-mail não foi encontrado!</div>',
        modal_success: '<div id="notification-success" class="modal fade bs-example-modal-sm" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">\n\
               <div class="modal-dialog modal-sm" role="document">\n\
                <div class="modal-content success">\n\
                 <div class="modal-header">\n\
                 <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n\
                  <h4 class="modal-title" id="exampleModalLabel">Titútlo mensagem</h4>\n\
                   </div>\n\
                    <div class="modal-body">\n\
                         <p class="">' + msgSuccess + '</p>\n\
                  </div>\n\
                </div>\n\
               </div>\n\
             </div>',
        modal_error: '<div id="error-notification" class="modal fade bs-example-modal-sm" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">\n\
               <div class="modal-dialog modal-sm" role="document">\n\
                <div class="modal-content error">\n\
                 <div class="modal-header">\n\
                 <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n\
                  <h4 class="modal-title" id="exampleModalLabel">Titútlo mensagem</h4>\n\
                   </div>\n\
                    <div class="modal-body">\n\
                         <p class="">' + msgError + '</p>\n\
                  </div>\n\
                </div>\n\
               </div>\n\
             </div>',
        
        progress_bar: ' <div class="progress">\n\
                           <div class="progress-bar" role="progressbar" aria-valuenow="2" aria-valuemin="0" aria-valuemax="100" style="min-width: 0em; width: 0%;">\n\
                              0%\n\
                          </div>\n\
                        </div>'
    };
}

function check_tagHtml(current_form){
    var check_tagHtml_submit = $(current_form).find('[type=submit]');
    var return_tagHtml_submit = $(check_tagHtml_submit).prop("tagName");
    return return_tagHtml_submit;
}

function waitingSent(current_form) {   
var response = check_tagHtml(current_form);    
    if(response == 'INPUT'){
        $(current_form).find('[type=submit]').val('Enviando...');
    }
    $(current_form).find('[type=submit]').text('Enviando...');
    $(current_form).find('[type=submit]').css({opacity: 0.7});
    $(current_form).find('[type=submit]').addClass("disabled");
}

function returnOfValues(current_form) { 
    var response = check_tagHtml(current_form);
    if(response == 'INPUT'){
       $(current_form).find('[type=submit]').val('Enviar mensagem'); 
    }  
    $(current_form).find('[type=submit]').text('Enviar mensagem');
    $(current_form).find('[type=submit]').removeAttr('style');
    $(current_form).find('[type=submit]').removeClass('disabled');
}

function timeRemoveMessage(current_form) {
    setTimeout(function ()
    {
        $(current_form).find('.alert').remove();
    }, 3000);
}

function addHTML(html, current_form) {
    $(current_form).append(html);
}

function resetDataForm(current_form) {
    $(current_form)[0].reset();
}

function checkVariableData(current_form, data_variable, value) {
    if ($(current_form).data(data_variable) === value) {
        return true;
    }
}

function sendAJAX(current_form, formdata) {
   /* Verifica se já adicionou o progress_bar no DOM */
   var progress_bar = 1;
    $.ajax({
        url: $(current_form).attr('action'),
        type: 'POST',
        data: formdata,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            waitingSent(current_form);
        },
        statusCode: {
            404: function () {
                addHTML(checkData(current_form).warning , current_form);
                returnOfValues(current_form);
                timeRemoveMessage(current_form);
                resetDataForm(current_form);
                console.warn(' Não foi possível localizar endereço de envio de '
                        + ' e-mail que foi informado no formulário:  ' + $(current_form).attr('action'));
            }
        },
        success: function (data) {
            if (data.status === 'success') {
                delete formdata;

                if (typeof checkVariableData(current_form, 'notification', 'modal') !== 'undefined') {
                    
                    addHTML(checkData(current_form).modal_success, current_form);
                    $('#notification-success').modal();
                } else {
                    addHTML(checkData(current_form).success, current_form);
                    timeRemoveMessage(current_form);
                }

                returnOfValues(current_form);
                resetDataForm(current_form);
            } else {              
                if (typeof checkVariableData(current_form, 'notification', 'modal') !== 'undefined') {
                    addHTML(checkData(current_form).modal_error, current_form);
                    $('#error-notification').modal();
                }else {
                    addHTML(checkData(current_form).error, current_form);;
                     timeRemoveMessage(current_form);
                }
                
                returnOfValues(current_form);
            }
        },
        
           // MOSTRANDO % DO UPLOAD DO ARQUIVO SELECIONADO
            xhr: function () {  // Custom XMLHttpRequest
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) { // Avalia se tem suporte a propriedade upload
                    myXhr.upload.addEventListener('progress', function (e) { //Avaliando progresso
                        //$("#loadingimg").attr("src", "loading.gif"); //FALAR QUE ESTÁ CARREGANDO A IMAGEM
                        if (e.lengthComputable) {
                            var percentComplete = e.loaded / e.total;
                            percentComplete = parseInt(percentComplete * 100);
  
                        if (progress_bar == 1 && typeof $(current_form).find('[type=file]').attr('type') !== 'undefined' 
                                && $(current_form).find('[type=file]').val() != '') {
                            
                            addHTML(checkData(current_form).progress_bar, current_form);
                            progress_bar++;
                        }
                            $(current_form).find('[type=submit]').text('Enviando . . .');
                                                
                            $(current_form).find('.progress-bar').css({width: percentComplete+'%'});
                            $(current_form).find('.progress-bar').text(percentComplete + '%');
                            
                            if (percentComplete == 100) {
                                setTimeout(function(){ 
                                    $(current_form).find('.progress').remove(); }, 4000);
                                
                            }
                        }
                    }, false);
                }
                return myXhr;
            }
    });
}
