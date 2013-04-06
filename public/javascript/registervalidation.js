$(function($){
		   
	// simple jQuery validation script
	$('#register').submit(function(){
		
		var valid = true;
		var errormsg = 'This field is required!';
		var errorcn = 'error';
		
		$('.' + errorcn, this).remove();			
		
		$('.required', this).each(function(){
			var parent = $(this).parent();
			if( $(this).val() == '' ){
				console.log('field is empty');
				console.log($(this).attr('title'));
				var msg = $(this).attr('title');   // title is assigned in html, refers to err message
				msg = (msg != '') ? msg : errormsg; //default
				$('<span class="'+ errorcn +'">'+ msg +'</span>')
					.appendTo(parent)
					.fadeIn('fast')
					.click(function(){ $(this).remove(); })
				valid = false;
			};
		});
		if($('#register_password').val() != $('#confirm_password').val()){
			var parent = $('#confirm_password').parent();
			var msg = "Make sure password and confirm password match";
			$('<span class="'+ errorcn +'">'+ msg +'</span>')
					.appendTo(parent)
					.fadeIn('fast')
					.click(function(){ $(this).remove(); })
			valid = false;
		}

		return valid;
	});
	
})