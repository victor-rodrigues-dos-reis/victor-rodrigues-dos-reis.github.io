$(document).ready(function() {
	// VARIÁVEIS GLOBAIS
	var triedSubmitForm = false;	// Indica se o cliente já tentou enviar o formulário

	// Esconde a tela de loading quando a página terminar de carregar
	$("#loader-wrapper").fadeOut("slow");	

	// Enviar os dados do formulário ao servidor
	$('#contact-form').submit(function() {
		const formData = $('#contact-form').serialize();

		if(verifyForm()) {
			$.post("https://victor-rodrigues.000webhostapp.com/send-email.php", formData, function(response, status) {
				if (status == 'success') {
					if (response != 'success'){
						showSuccessFormMessage();
						disableFormFields();

					}
					else {
						Swal.fire('Ops, ocorreu um erro', response, 'error');

					}
				}
				else {
					Swal.fire(
						'Erro ao enviar formulário', 
						'Não foi possível enviar o formulário de contato, por favor tente novamente mais tarde', 
						'error');
				}
			});


		}

		event.preventDefault();
	});

	// Observa o que está sendo digitado nos inputs após mostrar a mensagem de ajuda
	$('.form-control').on('change paste keydown', function() {
		if (triedSubmitForm) {
			verifyForm();

		}
	});
	
	// Observa quando for clicado no ícone do menu
	$('#menu-icon').click(function() {
		$('#lateral-menu nav').slideToggle('slow');
	});

	// Verifica se o formulário foi preenchido corretamente
	function verifyForm() {
		const clientName = $('input[name="name"]').val();
		const clientEmail = $('input[name="email"]').val();
		const clientMessage = $('textarea[name="message"]').val();
		let isTheFormValid = true;

		if (clientName.length < 5) {
			createFormHelpMessage(1);
			isTheFormValid = false;

		}
		else
			hideFormHelpMessage('#name-help');


		if (clientEmail.length < 10) {
			createFormHelpMessage(2);
			isTheFormValid = false;

		}
		else if (!validateEmail(clientEmail)) {
			createFormHelpMessage(4);
			isTheFormValid = false;

		}
		else
			hideFormHelpMessage('#email-help');


		if (clientMessage.length < 20) {
			createFormHelpMessage(3);
			isTheFormValid = false;

		}
		else
			hideFormHelpMessage('#message-help');

		triedSubmitForm = true;
		return isTheFormValid;
	}

	// Verifica se o e-mail digitado é válido
	function validateEmail(email) {
		// Expressão regular que valida e-mails
		const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		return regularExpression.test(email);
	}

	// Cria as mensagens de ajuda para auxiliar o cliente a preenche o formulário corretamente
	function createFormHelpMessage(exceptionID) {
		let message = 'Preencha o campo com ';
		let targetInputHelp = null;

		switch(exceptionID) {
			case 1:
			message += 'no mínimo 5 caracteres.';
			targetInputHelp = '#name-help';

			break;
			case 2:
			message += 'no mínimo 10 caracteres.';
			targetInputHelp = '#email-help';

			break;
			case 3:
			message += 'no mínimo 20 caracteres.';
			targetInputHelp = '#message-help';

			break;
			case 4:
			message += 'um e-mail válido.';
			targetInputHelp = '#email-help';

			break;
		}

		showFormHelpMessage(targetInputHelp, message);
	}

	// Apresenta a mensagem de ajuda do input e adiciona a class 'invalid-input' no input
	function showFormHelpMessage(targetInputHelp, message) {
		const targetInput = $(targetInputHelp).siblings('.form-control');

		$(targetInput).addClass('invalid-input');
		$(targetInputHelp).text(message);
		$(targetInputHelp).slideDown();
	}

	// Esconde a mensagem de ajuda do input e remove a class 'invalid-input' do input
	function hideFormHelpMessage(targetMessageHelp) {
		let targetInput = $(targetMessageHelp).siblings('.form-control');

		targetInput.removeClass('invalid-input');
		$(targetMessageHelp).slideUp();
	}

	// Mostra mensagem indicando que o formulário foi enviado com sucesso
	function showSuccessFormMessage() {
		const Toast = Swal.mixin({
			toast: true,
			position: 'top-end',
			showConfirmButton: false,
			timer: 3000
		});

		Toast.fire({
			type: 'success',
			title: 'Formulário enviado'
		});
	}

	// Desabilita os campos do formulário e esconde o botão de submit
	function disableFormFields() {
		$('input[name="name"]').attr('disabled', 'disabled');
		$('input[name="email"]').attr('disabled', 'disabled');
		$('textarea[name="message"]').attr('disabled', 'disabled');
		$('#contact-form button').slideUp();
	}

});
