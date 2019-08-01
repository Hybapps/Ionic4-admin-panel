<?php
use App\v1\crudController;
use App\v1\mobileController;


use Slim\Http\Request;
use Slim\Http\Response;

use Respect\Validation\Validator as v;
// Routes
// Users Group

$app->group('/v1', function () {
    $this->group('/crud', function() {
        $this->map(['GET','POST'],'/get/{table}/[{page}]', crudController::class.':get');
        //$this->post('/get/{table}', crudController::class.':get');
        $this->post('/add/{table}', crudController::class.':add');
        
        $this->post('/bulkAdd/{table}', crudController::class.':bulkAdd');

        $this->post('/update/{table}/{primary}/{id}', crudController::class.':update');
        $this->delete('/delete/{table}/{primary}/{id}', crudController::class.':delete');
        $this->post('/upload', crudController::class.':upload');

        $this->post('/excelupload', crudController::class.':excelupload');
        $this->post('/renameFolder', crudController::class.':renameFolder');

        
    });
    $this->group('/mobile', function() {
      
        $this->post('/sendNotification',mobileController::class.':sendNotification');
        $this->post('/userLogin',mobileController::class.':userLogin');
        $this->post('/userRegister',mobileController::class.':userRegister');
        $this->post('/userBasicRegister',mobileController::class.':userBasicRegister');
         $this->post('/userUpdateProfile',mobileController::class.':userUpdateProfile');
   
        $this->get('/getRegisterationData/[{temp}]',mobileController::class.':getRegisterationData');
        $this->get('/getSchools/{schoolGovId}',mobileController::class.':getSchools');
        $this->get('/listSubjects/{GradeId}/{optional}/[{studentId}]',mobileController::class.':listSubjects');
        $this->get('/userExists/{telNumber}',mobileController::class.':userExists');
        $this->post('/addOptionalSubjects',mobileController::class.':addOptionalSubjects');
        $this->get('/listLessons/{subjectId}',mobileController::class.':listLessons');
        $this->get('/getLessonDetails/{lessonId}/{userId}',mobileController::class.':getLessonDetails');
        $this->get('/getUserDetails/{userId}',mobileController::class.':getUserDetails');
        $this->get('/getLessonAttach/{lessonId}',mobileController::class.':getLessonAttach');
        $this->post('/likeLesson',mobileController::class.':likeLesson');
        $this->post('/deleteLikeLesson',mobileController::class.':deleteLikeLesson');
        $this->post('/updateToLike',mobileController::class.':updateToLike');
        $this->post('/disLikeLesson',mobileController::class.':disLikeLesson');
        $this->post('/deleteDislikeLesson',mobileController::class.':deleteDislikeLesson');
        $this->post('/updateToDislike',mobileController::class.':updateToDislike');
        $this->post('/addRate',mobileController::class.':addRate');
        $this->get('/getLessonRates/{lessonId}/{userId}',mobileController::class.':getLessonRates');
        $this->post('/updatePassword',mobileController::class.':updatePassword');
        $this->post('/changePassword',mobileController::class.':changePassword');
        $this->get('/lessonComments/{lessonId}/{offset}',mobileController::class.':lessonComments');
    });    

});