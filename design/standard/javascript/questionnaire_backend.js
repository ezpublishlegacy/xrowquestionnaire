/**
 * Javascript for edit template
 */

jQuery(document)
		.ready(
				(function() {
					
					if (jQuery("input.jquery-datepicker").length) {
						
						jQuery.datepicker.setDefaults(jQuery.datepicker.regional["de"]);
						
						jQuery("input.jquery-datepicker").datepicker({
							minDate : new Date(),
							altField : "#date-picker-alternate-date",
							altFormat : '@', // Gives a timestamp dateformat
							dateFormat : "dd.mm.yy"
						});
						jQuery('input.jquery-datepicker').change(function() { 
							if ( !jQuery(this).val() )
							{
								jQuery(this).siblings( 'input.xrowquestionnaire-alternate-date' ).val( '' );
							}
						});
						
						if( jQuery("#date-picker-alternate-date").val() ){
							var startdate = new Date( parseInt( jQuery("#date-picker-alternate-date").val(), 10 ) );
							$("input.jquery-datepicker").datepicker('setDate', startdate );
						}
						
					}
					
					if (jQuery('#tabsView').length) {
						jQuery("#tabsView").sortable({
							stop : function(event, ui) {
								updatePosition('questions');
							}
						});

						jQuery('#tabsView ul.draggable').each(function(index) {
							jQuery(this).css('cursor', 'move');
						});

						jQuery("#tabsView").each(function() {
							jQuery(".question_tabs", this).tabs();
						});

						jQuery("[id^=sortable_]").sortable({
							stop : function(event, ui) {
								var id = jQuery('.parentID', this).val();
								updatePosition('answers', id);
							}
						}).css('cursor', 'move');

						if (jQuery('button.uploadImage')) {
							jQuery('button.uploadImage')
									.on(
											'click',
											function(e) {
												var idArray = jQuery(this)
														.attr('id').split('_'), url = jQuery(
														'input#'
																+ jQuery(this)
																		.attr(
																				'id')
																+ '_url').val(), page_top = e.pageY - 400, body_half_width = jQuery(
														'body').width() / 2;
												if (body_half_width > 510)
													var page_left = body_half_width - 200;
												else
													var page_left = body_half_width - 300;
												var innerHTML = '<div id="mce_'
														+ idArray[3]
														+ '" class="clearlooks2" style="width: 510px; height: 509px; top: '
														+ page_top
														+ 'px; left: '
														+ page_left
														+ 'px; overflow: auto; z-index: 300020;">'
														+ '<div id="mce_'
														+ idArray[3]
														+ '_top" class="mceTop"><div class="mceLeft"></div><div class="mceCenter"></div><div class="mceRight"></div><span id="mce_'
														+ idArray[3]
														+ '_title">Upload new Image</span></div>'
														+ '<div id="mce_'
														+ idArray[3]
														+ '_middle" class="mceMiddle">'
														+ '<div id="mce_'
														+ idArray[3]
														+ '_left" class="mceLeft"></div>'
														+ '<span id="mce_'
														+ idArray[3]
														+ '_content">'
														+ '<iframe src="'
														+ url
														+ '" class="uploadFrame_xrowquestionnaire" id="uploadFrame_'
														+ jQuery(this).attr(
																'id')
														+ '" name="uploadFrame_'
														+ jQuery(this).attr(
																'id')
														+ '" style="border: 0pt none; width: 500px; height: 480px;" />'
														+ '</span>'
														+ '<div id="mce_'
														+ idArray[3]
														+ '_right" class="mceRight"></div>'
														+ '</div>'
														+ '<div id="mce_'
														+ idArray[3]
														+ '_bottom" class="mceBottom"><div class="mceLeft"></div><div class="mceCenter"></div><div class="mceRight"></div><span id="mce_'
														+ idArray[3]
														+ '_status">Content</span></div>'
														+ '<a class="mceClose" id="mce_'
														+ idArray[3]
														+ '_close"></a>'
														+ '</div>' + '</div>', blocker = '<div id="mceModalBlocker" class="clearlooks2_modalBlocker" style="z-index: 300017; display: block;"></div>';
												jQuery('body')
														.append(innerHTML);
												jQuery('body').append(blocker);

												jQuery(
														'a#mce_' + idArray[3]
																+ '_close')
														.on(
																'click',
																function(e) {
																	jQuery(
																			'#mce_'
																					+ idArray[3])
																			.remove();
																	jQuery(
																			'#mceModalBlocker')
																			.remove();
																});

											});
						}

					}
				}));

// Backend: edit
function addRange(base, attr) {
	jQuery.ez('xrowquestionnaire_page::addRange', {
		'base' : base,
		'attr' : attr
	}, function(data) {
		var position = jQuery('#pointsRange > ul > li').size() + 1;
		var id = Math.round((new Date()).getTime() / 100);

		var range = data.content.template;
		var newRange = range.replace(/{\$id}/g, id).replace(/{\$position}/g,
				position);

		jQuery(newRange).appendTo('#pointsRange ul');
	});
}

function add(base, attr, contentobject_id, version) {
	jQuery.ez('xrowquestionnaire_page::add', {
		'attr' : attr,
		'base' : base,
		'contentobject_id' : contentobject_id,
		'version' : version
	}, function(data) {
		var position = jQuery('#tabsView > .question_tabs').size() + 1;
		var id = Math.floor(Math.random() * 2147483647);

		var tabs = data.content.template;
		var newTabs = tabs.replace(/{\$id}/g, id).replace(/{\$position}/g,
				position);
		jQuery(newTabs).tabs().appendTo('#tabsView');
		addAnswer(id, base, attr, contentobject_id, version, true);
	});

}

function addAnswer(id, base, attr, contentobject_id, version, change) {

	var answerCount = 1;
	var answerText = new Array('');
	var answerPoints = new Array('0');

	jQuery.ajaxSetup({
		async : false
	});
	if (change === true) {
		jQuery.ez('xrowquestionnaire_page::getAnswerSettings', {
			'answer_type' : jQuery('.new_set_' + id).val()
		}, function(data) {
			answerCount = data.content.settings.AnswerText.length;
			answerText = data.content.settings.AnswerText;
			answerPoints = data.content.settings.AnswerPoints;
		});
		jQuery('#sortable_' + id + '> .answerelement').remove();
	}
	for ( var i = 0; i < answerCount; i++) {
		jQuery.ez('xrowquestionnaire_page::addAnswer', {
			'attr' : attr,
			'base' : base,
			'contentobject_id' : contentobject_id,
			'version' : version
		}, function(data) {
			// id is the parentID & the answerID is the unique ID
			var readOnly = '';
			var position = jQuery('#sortable_' + id + ' > li').size() + 1;
			var answerID = Math.floor(Math.random() * 2147483647);
			var answer = data.content.template;
			answer = answer.replace(/{\$id}/g, id);
			answer = answer.replace(/{\$position}/g, position);
			answer = answer.replace(/{\$answerID}/g, answerID);
			answer = answer.replace(/{\$readOnly}/g, readOnly);
			answer = answer.replace(/{\$answer_text}/g, answerText[i]);
			if (typeof answerPoints != 'undefined') {
				answer = answer.replace(/{\$answer_points}/g, answerPoints[i]);
			} else {
				answer = answer.replace(/{\$answer_points}/g, '');
			}
			jQuery('#sortable_' + id).append(answer);
		});
	}
	jQuery("#sortable_" + id).sortable({
		stop : function(event, ui) {
			updatePosition('answers', id);
		}
	}).css('cursor', 'move');
}

function updatePosition(node, id) {
	if (node == 'questions') {
		jQuery('#tabsView > .question_tabs').each(function(index) {
			jQuery(".questionPosition", this).attr('value', index + 1);
		})
	}
	if (node == 'answers') {
		jQuery('#sortable_' + id + ' > li').each(function(index) {
			jQuery(".answerPosition", this).attr('value', index + 1);
		})
	}
}

function removeOnChange(id) {
	jQuery('.new_set_' + id).removeAttr('onchange');
}

function remove_question( node, id) {
	node.remove();
	updatePosition('questions');
}

function remove_range(node) {
	jQuery('.' + node).remove();
}

function removeAnswer(node, position)
{	
	node.remove();
	updatePosition('answers', position);
}