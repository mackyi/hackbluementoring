$(function() {  
			$("#searchButton").click(function() {  
				console.log('triggered jquery')
				$.ajax({
					type: 'POST',
					url: '/findMentors',
					data: { 
						firstName: $('#firstName').val(),
						lastName: $('#lastName').val(),
						areas: $('#areas').val(),
						minRating: $("#minRating").val(),
					},
					dataType: 'application/json',
					mimeType: 'application/json',
					success: function(response, textStatus, XMLHttpRequest) { 
						console.log('succeeded'); 
					    $('#searchResults').html(response);
					}
				});
			});  
		}); 