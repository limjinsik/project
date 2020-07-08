var db = null;
var var_no = null;
var position = null;
var index;

// 데이터베이스 생성 및 오픈
function openDB(){
   db = window.openDatabase('bookDB', '1.0', '웹툰별점DB',1024*1024);
   console.log('1_DB 생성...');
}
// 테이블 생성 트랜잭션 실행
function createTable() {
   db.transaction(function(tr){
   var createSQL = 'create table book(type, date, name, sit, img)';
   tr.executeSql(createSQL, [], function(){
     		console.log('2_1_테이블생성_sql 실행 성공...');
	   }, function(){
	      console.log('2_1_테이블생성_sql 실행 실패...');
	   });
	   }, function(){
	      console.log('2_2_테이블 생성 트랜잭션 실패...롤백은 자동');
	   }, function(){
	      console.log('2_2_테이블 생성 트랜잭션 성공...');
     });
 }

 // 데이터 입력 트랜잭션 실행
 function insertBook(){
    db.transaction(function(tr){
  		var type = $('#bookType1').val();
      var date = $('#bookdate1').val();
  		var name = $('#bookName1').val();
      var sit = $('#bookscr1').val();
      var img = $('#bookimg1').val();
  		var insertSQL = 'insert into book(type, date, name, sit, img) values(?, ?, ?, ?, ?)';
     	tr.executeSql(insertSQL, [type, date, name, sit, img], function(tr, rs){
      	    console.log('3_ 책 등록...no: ' + rs.insertId);
	        alert('도서명 ' + $('#bookName1').val() + ' 이 입력되었습니다');
	   		$('#bookName1').val('');
        $('#bookscr1').val('');
        $('#bookimg1').val('');
			$('#bookType1').val('미정').attr('selected', 'selected');
			$('#bookType1').selectmenu('refresh');
      $('#bookdate1').val('미정').attr('selected', 'selected');
			$('#bookdate1').selectmenu('refresh');
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
    });
 }

// 전체 데이터 검색 트랜잭션 실행
function listBook(){
  db.transaction(function(tr){
 	var selectSQL = 'select * from book';
  	tr.executeSql(selectSQL, [], function(tr, rs){
       console.log(' 책 조회... ' + rs.rows.length + '건.');
       if (position == 'first') {
       	  if(index == 0)
       	  	alert('더 이상의 도서가 없습니다');
          else
          	index = 0;
	   	 }
       else if (position == 'prev') {
       	  if(index == 0)
       	  	alert('더 이상의 도서가 없습니다');
          else
          	index = --index;
	 		 }
       else if (position == 'next') {
       	  if(index == rs.rows.length-1)
       	  	alert('더 이상의 도서가 없습니다');
		      else
		      	index = ++index;
       }
       else
       {
       	  if(index == rs.rows.length-1)
       	  	alert('더 이상의 도서가 없습니다');
		      else
	       	  index = rs.rows.length-1;
       }
       $('#bookType4').val(rs.rows.item(index).type);
       $('#bookdate4').val(rs.rows.item(index).date);
       $('#bookName4').val(rs.rows.item(index).name);
       $('#bookscr4').val(rs.rows.item(index).sit);
       $('#bookimg4').val(rs.rows.item(index).img)
       $('#view').attr('src', rs.rows.item(index).img);
 		});
  });
}
// 데이터 수정 트랜잭션 실행
function updateBook(){
    db.transaction(function(tr){
    	var type = $('#bookType2').val();
      var date = $('#bookdate2').val();
      var sit = $('#bookscr2').val();
      var img = $('#bookimg2').val();
    	var new_name = $('#bookName2').val();
    	var old_name = $('#sBookName2').val();
		var updateSQL = 'update book set type = ?, date = ?, name = ?, sit = ?, img = ? where name = ?';
     	tr.executeSql(updateSQL, [type, date, sit, img, new_name, old_name], function(tr, rs){
	         console.log('5_책 수정.... ') ;
	         alert('새로 수정되었습니다');
	   		 $('#bookName2').val(''); $('#sBookName2').val('');
         $('#Bookimg2').val(''); $('#Bookscr2').val('');
	   		 $('#bookType2').val('미정').attr('selected', 'selected');
			 $('#bookType2').selectmenu('refresh');
       $('#bookdate2').val('미정').attr('selected', 'selected');
     $('#bookdate2').selectmenu('refresh');
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
    });
}
// 데이터 삭제 트랜잭션 실행
function deleteBook(){
   db.transaction(function(tr){
	  var name = $('#sBookName3').val();
 	  var deleteSQL = 'delete from book where name = ?';
	  tr.executeSql(deleteSQL, [name], function(tr, rs){
	     console.log('6_책 삭제... ');
	     alert($('#bookName3').val() + '웹툰이 삭제되었습니다');
	   	 $('#bookType3').val(''); $('#bookName3').val(''); $('#sBookName3').val(''); $('#bookimg3').val(''); $('#bookscr3').val(''); $('#bookdate3').val('');
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
   });
}
// 데이터 수정 위한 데이터 검색 트랜잭션 실행
function selectBook2(name){
   db.transaction(function(tr){
	 var selectSQL = 'select type, date, name, sit, img from book where name=?';
  	 tr.executeSql(selectSQL, [name], function(tr, rs){
  	 	 $('#bookType2').val(rs.rows.item(0).type).attr('selected', 'selected');
	 		 $('#bookType2').selectmenu('refresh');
       $('#bookdate2').val(rs.rows.item(0).date).attr('selected', 'selected');
	 		 $('#bookdate2').selectmenu('refresh');
       $('#bookName2').val(rs.rows.item(0).name);
       $('#bookscr2').val(rs.rows.item(0).sit);
       $('#bookimg2').val(rs.rows.item(0).img);
	 	});
   });
}
// 데이터 삭제 위한 데이터 검색 트랜잭션 실행
function selectBook3(name){
   db.transaction(function(tr){
 	 var selectSQL = 'select type, date, name, sit, img from book where name=?';
		tr.executeSql(selectSQL, [name], function(tr, rs){
			 $('#bookType3').val(rs.rows.item(0).type);
       $('#bookdate3').val(rs.rows.item(0).date);
       $('#bookName3').val(rs.rows.item(0).name);
       $('#bookscr3').val(rs.rows.item(0).sit);
       $('#bookimg3').val(rs.rows.item(0).img);
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
	});
}
// 데이터 조건 검색 트랜잭션 실행
function selectBook4(name){
   db.transaction(function(tr){
 	 var selectSQL = 'select type, date, name, sit, img from book where name=?';
  	 tr.executeSql(selectSQL, [name], function(tr, rs){
         $('#bookType4').val(rs.rows.item(0).type);
         $('#bookdate4').val(rs.rows.item(0).date);
         $('#bookName4').val(rs.rows.item(0).name);
         $('#bookscr4').val(rs.rows.item(0).sit);
         $('#bookimg4').val(rs.rows.item(index).img)
         $('#view').attr('src', rs.rows.item(index).img);
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
   });
 };
