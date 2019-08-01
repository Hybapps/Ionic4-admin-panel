<?php
namespace App\v1;
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class mobileController
{
  
    public $db;
    public $response;
    public $request;
  
    public function __construct(ContainerInterface $container)
    {
      
        $this->db = $container->get('db');
       // echo $this->db;
    }
    
//---------------------

  //---user Login
  public function userLogin(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

            
            $sql[0]="select users.*,gradeNameAr,stageNameAr from users inner join stages inner join grades on users.userStageId = stages.stageId and users.userGradeId = grades.gradeId where userMob='".$inputs['userMob']."' and usePW='".$inputs['usePW'] ."' and userActive=1";
         
            $sql[1]="update users set userToken='".$inputs['userToken']."' where userId=:id and userActive=1";
            


       //echo $sql[0];
        $responseData = array();

      $sth = $this->db->prepare($sql[0]);
      try{
            $sth->execute();
            $data = $sth->fetchAll();
            if(sizeof($data)>0) //success login
                {
                $responseData['error'] = false; 
                $responseData['rowsCount'] = 1;
                $responseData['data'] = $data; 
                //----Update token----
                $id=$data[0]['userId'];
                $sth = $this->db->prepare($sql[1]);
                $sth->bindParam(':id',$id);
                $sth->execute();
 
                }
            else
                {
                $responseData['error'] = false; 
                $responseData['rowsCount'] = 0;
               // $responseData['data'] = [];
                }
        
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}

  //---forget password
  public function userExists(Request $request, Response $response, $args)
{
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();
        $number = $args['telNumber'];
            
        $sql="select * from users where userMob=$number and userActive=1";

            
       //echo $sql;
        $responseData = array();

      $sth = $this->db->prepare($sql);
      try{
            $sth->execute();
            $data = $sth->fetchAll();
            if(sizeof($data)>0) //user exists
                {
                $responseData['error'] = false; 
                $responseData['rowsCount'] = 1;
                $responseData['data'] = $data[0]; 
                }
            else
                {
                $responseData['error'] = false; 
                $responseData['rowsCount'] = 0;
               // $responseData['data'] = [];
                }
        
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }

      return $this->response->withJson($responseData);
     
   
}


  //---user registeration
  public function userRegister(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

        $sql[0]="select * from users where userMob=:userMob or userEmail=:userEmail";
        
        $sql[1]="insert into users (userType,userName,userMob,userEmail,usePW,userSchoolId,userGradeId,userGender,userBirthDate,userToken,userStageId,userGovId) values(:userType,:userName,:userMob,:userEmail,:usePW,:userSchoolId,:userGradeId,:userGender,:userBirthDate,:userToken,:userStageId,:userGovId)";



      // echo $sql[0];
        $responseData = array();

      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->bindParam(':userMob',$inputs['userMob']);
            $sth->bindParam(':userEmail',$inputs['userEmail']);

            $sth->execute();
            $data = $sth->fetchAll();
            if(sizeof($data)>0) //duplicate user mobile or email
                {
                if($data[0]['userMob']==$inputs['userMob'])
                    {
                        $errorCode=1;
                        $errorMessage="Duplicate mobile";
                    }
                if($data[0]['userEmail']==$inputs['userEmail'])
                    {
                        $errorCode=2;
                        $errorMessage="Duplicate Email";

                    }
                if($data[0]['userEmail']==$inputs['userEmail'] && $data[0]['userMob']==$inputs['userMob'])
                    {
                        $errorCode=3;
                        $errorMessage="Duplicate Mobile & Email";
                        
                    }

                    
                $responseData['error'] = true; 
                $responseData['errorMessage'] = $errorMessage;
                $responseData['errorCode'] = $errorCode;
                }
            else
                {
                $sth = $this->db->prepare($sql[1]);

                $sth->bindParam(':userType',$inputs['userType']);
                $sth->bindParam(':userName',$inputs['userName']);
                $sth->bindParam(':userMob',$inputs['userMob']);
                $sth->bindParam(':userEmail',$inputs['userEmail']);
                $sth->bindParam(':usePW',$inputs['usePW']);
                $sth->bindParam(':userSchoolId',$inputs['userSchoolId']);
                $sth->bindParam(':userGradeId',$inputs['userGradeId']);
                $sth->bindParam(':userGender',$inputs['userGender']);
                $sth->bindParam(':userBirthDate',$inputs['userBirthDate']);
                $sth->bindParam(':userToken',$inputs['userToken']);
                $sth->bindParam(':userStageId',$inputs['userStageId']);
                $sth->bindParam(':userGovId',$inputs['userGovId']);
                

                $sth->execute();
                $responseData['error'] = false; 
                $responseData['id'] = $this->db->lastInsertId();
                }
        
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}

 //---user Basic registeration
  public function userBasicRegister(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

        $sql[0]="select * from users where userMob=:userMob and userActive=1";
        
        $sql[1]="insert into users (userType,userName,userMob,usePW,userGradeId,userToken,userStageId) values(:userType,:userName,:userMob,:usePW,:userGradeId,:userToken,:userStageId)";



      // echo $sql[0];
        $responseData = array();

      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->bindParam(':userMob',$inputs['userMob']);

            $sth->execute();
            $data = $sth->fetchAll();
            if(sizeof($data)>0) //duplicate user mobile or email
                {

                        $errorCode=1;
                        $errorMessage="Duplicate mobile";
                    
                $responseData['error'] = true; 
                $responseData['errorMessage'] = $errorMessage;
                $responseData['errorCode'] = $errorCode;
                }
            else
                {
                $sth = $this->db->prepare($sql[1]);

                $sth->bindParam(':userType',$inputs['userType']);
                $sth->bindParam(':userName',$inputs['userName']);
                $sth->bindParam(':userMob',$inputs['userMob']);
                $sth->bindParam(':usePW',$inputs['usePW']);
                $sth->bindParam(':userGradeId',$inputs['userGradeId']);
                $sth->bindParam(':userToken',$inputs['userToken']);
                $sth->bindParam(':userStageId',$inputs['userStageId']);


                $sth->execute();
                $responseData['error'] = false; 
                $responseData['id'] = $this->db->lastInsertId();
                }
        
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}



  //---user uodateProfile
  public function userUpdateProfile(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

        $sql[0]="select * from users where userEmail=:userEmail and userId<>:userId";
        
        $sql[1]="update  users set userName = :userName,userEmail=:userEmail,userSchoolId=:userSchoolId,userGradeId =:userGradeId ,userGender= :userGender ,userBirthDate = :userBirthDate ,userStageId =:userStageId ,userGovId = :userGovId,optionalSubjects = :optionalSubjects where userId=:userId";



      // echo $sql[0];
        $responseData = array();

      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->bindParam(':userEmail',$inputs['userEmail']);
            $sth->bindParam(':userId',$inputs['userId']);

            $sth->execute();
            $data = $sth->fetchAll();
            if(sizeof($data)>0) //duplicate  email
                {
 
                        $errorCode=2;
  
                $responseData['error'] = true; 
                $responseData['errorMessage'] = 'Dublicate Email';
                $responseData['errorCode'] = $errorCode;
                }
            else
                {
                $sth = $this->db->prepare($sql[1]);

                $sth->bindParam(':userName',$inputs['userName']);
                $sth->bindParam(':userEmail',$inputs['userEmail']);
                $sth->bindParam(':userSchoolId',$inputs['userSchoolId']);
                $sth->bindParam(':userGradeId',$inputs['userGradeId']);
                $sth->bindParam(':userGender',$inputs['userGender']);
                $sth->bindParam(':userBirthDate',$inputs['userBirthDate']);
                $sth->bindParam(':userStageId',$inputs['userStageId']);
                $sth->bindParam(':userGovId',$inputs['userGovId']);
                $sth->bindParam(':userId',$inputs['userId']);
                $sth->bindParam(':optionalSubjects',$inputs['optionalSubjects']);
                

                $sth->execute();
                $responseData['error'] = false; 
                }
        
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}

  //---Get registeration Data
  public function getRegisterationData(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

        $sql[0]="select * from stages order by stageOrder";
        $sql[1]="select * from grades order by gradeOrder";
        $sql[2]="select * from governments where govCountryId=17 order by govNameAr";
        $stages= array();
        $grades= array();
        $governments= array();



      // echo $sql[0];
        $responseData = array();

      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->execute();
            $data = $sth->fetchAll();
            $stages['data']= $data;
            $stages['rowsCount']= sizeof($data);

            $sth = $this->db->prepare($sql[1]);
            $sth->execute();
            $data = $sth->fetchAll();
            $grades['data']= $data;
            $grades['rowsCount']= sizeof($data);

            $sth = $this->db->prepare($sql[2]);
            $sth->execute();
            $data = $sth->fetchAll();
            $governments['data']= $data;
            $governments['rowsCount']= sizeof($data);
            
            $responseData['error'] = false; 
            $responseData['stages'] = $stages; 
            $responseData['grades'] = $grades; 
            $responseData['governments'] = $governments; 
      
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}

 //---get government schools
  public function getSchools(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        
        $schoolGovId = $args['schoolGovId'];
        $result=array();

            
        $sql="select * from schools where schoolGovId=$schoolGovId order by schoolNameAr";
        $responseData = array();
      try{
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $data = $sth->fetchAll();
            $responseData['error'] = false; 
            $responseData['rowsCount']= sizeof($data);
            $responseData['data'] = $data; 
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}

//'/listSubjects/{GradeId}/{optional}
//---get grade subjects or student optional subjects
  public function listSubjects(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        
        $GradeId = $args['GradeId'];
        $optional = $args['optional'];
        $studentId = $args['studentId'];

        $result=array();
        $sql= array();
            
        $sql[0]="select * from subjects where subjectGradeId=$GradeId "; 
        $sql[0].="and subjectOptional=$optional ";
        $sql[0].="order by subjectNameAr";
       
       $sql[1]= "select * from subjects where find_in_set(subjectId,(select optionalSubjects from users where userId=$studentId))";
       
        // $sql[1]= "select subjects.* from  studentsSubjects inner join subjects
        //     on stusubSubjectId = subjectId where stusubStudentId=$studentId";
                
        $responseData = array();
      try{
          $data=array();
            if($optional == 0 || !$studentId)
            {
            $sth = $this->db->prepare($sql[0]);
            $sth->execute();
            $data = $sth->fetchAll();
            }
            if($studentId)//Get student choosen optional materials if any
            {
                $sth = $this->db->prepare($sql[1]);
                $sth->execute();
                $optionalSubjects = $sth->fetchAll();
                $data=array_merge($data,$optionalSubjects);
            }
            
            $responseData['error'] = false; 
            $responseData['rowsCount']= sizeof($data);
            $responseData['imagePath'] = "/uploadFolder/small/"; 

            $responseData['data'] = $data; 
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}



//chooseOptionalSubjects
//---chooseOptionalSubjects for students
  public function addOptionalSubjects(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        
        $inputs=array();
        $inputs = $request->getParsedBody();

        $studentId = $inputs['studentId'];
        $stusubSubjectId =  $inputs['stusubSubjectId'];
        
        $result=array();

        $sql="update users set optionalSubjects ='$stusubSubjectId' where userId=$studentId"; 
       
        $responseData = array();
        try
            {
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $responseData['error'] = false; 
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}

//listLessons
  public function listLessons(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        
        $subjectId = $args['subjectId'];

        $result=array();
        $sql= array();
            
        $sql="select * from units inner join lessons on units.unitId=lessons.lessonUnitId where unitSubjectId=$subjectId order by unitOrder,lessonOrder"; 

    
        $responseData = array();
      try{
          $data=array();
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $data = $sth->fetchAll();

            $unit=array();
            $lessons=array();
            $unitId=$data[0]['unitId'];
            $unit['unitId']=$data[0]['unitId'];
            $unit['unitNameAr']=$data[0]['unitNameAr'];

            $formatedData=array();
           // $unit['lessons']=array();
            
            for($i=0;$i<sizeof($data);$i++)
            {
      
                if($data[$i]['unitId']!=$unitId )
                    {
                    $unit['lessonsCount']=sizeof($lessons);
                   // array_push($unit['lessons'],$lessons);
                    $unit['lessons']=$lessons;
                    array_push($formatedData,$unit);
                    
                    $lessons=array();
                    $unit=array();
                    $unit['unitId']=$data[$i]['unitId'];
                    $unit['unitNameAr']=$data[$i]['unitNameAr'];
                    $unitId=$data[$i]['unitId'];
                   // $unit['lessons']=array();

                    }
                array_push($lessons,$data[$i]);
                if($i+1>=sizeof($data))
                {
                    $unit['lessonsCount']=sizeof($lessons);
                    $unit['lessons']=$lessons;
                    //array_push($unit['lessons'],$lessons);
                    array_push($formatedData,$unit);
                }
                    

            }
            $responseData['error'] = false; 
            $responseData['rowsCount']= sizeof($formatedData);
            $responseData['data'] = $formatedData; 
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}


//get Lesson Detils
  public function getLessonDetails(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        
        $lessonId = $args['lessonId'];
        $userId = $args['userId'];
        

        $result=array();
        $sql= array();
 
    //-------Viemo API to return thumpenils
    $ch = curl_init();
    $headers = array(
    'Content-Type:application/json',
    'Accept:application/vnd.vimeo.*+json;version=3.4',
    'Authorization:Bearer c5604d64b6a15197133d2f10a1e12f7c');
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_HEADER, 0);           
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);


 
            
        $sql="select lessons.*,units.unitNameAr,admins.adminName,subjects.subjectNameAr,
        (select `like` from likes where likes.userId=$userId)as userLike,(SELECT count(rateValue) FROM lessonsComments WHERE comUserId=$userId)as userRated
        from  lessons inner join units inner join subjects inner join admins
            on lessons.lessonUnitId = units.unitId and units.unitSubjectId = subjects.subjectId and 
            admins.adminId = lessons.lessonTeacherId
            where lessons.lessonId=$lessonId"; 


//--------
    
        $responseData = array();
      try{
          $data=array();
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $data = $sth->fetchAll();
            $lessonAttach=$data[0]['lessonAttach'];
            // $attachemntsArray=explode(",",$lessonAttach);
            // for( $i=0;$i<sizeof($attachemntsArray);$i++)
            // {
            //     $start=strpos($attachemntsArray[$i],'/');
            //     $end=strpos($attachemntsArray[$i],'.');
            //     $attachemnts[$i]['fileTitle']=substr($attachemntsArray[$i],$start+1,$end-$start-1);
            //     $attachemnts[$i]['fileName']=$attachemntsArray[$i];
            //     $attachemnts[$i]['fileType']=    $extension = pathinfo($attachemntsArray[$i], PATHINFO_EXTENSION);
                

                
            // }
            $lessonVideos=$data[0]['lessonVideo'];
            $videos=explode(",",$lessonVideos);
            
            $returnedVideos=array();
            for( $i=0;$i<sizeof($videos);$i++)
            {
                curl_setopt($ch, CURLOPT_URL, "https://api.vimeo.com/videos/".$videos[$i]."/pictures");
                $raw_data = curl_exec($ch);
                if ($raw_data === false)
                    break;                

                $viemoData=json_decode($raw_data, true);
               // echo( $viemoData['data'][0]['sizes'][0]['link']);
                $returnedVideos[$i]['id']=$videos[$i];
                $returnedVideos[$i]['smallImage']=$viemoData['data'][0]['sizes'][0]['link'];
                 $returnedVideos[$i]['bigImage']=$viemoData['data'][0]['sizes'][3]['link'];
               
            }
                            curl_close($ch);

            $responseData['error'] = false; 
            if(sizeof($returnedVideos)>0)
                $responseData['videos']=$returnedVideos;
            // if(sizeof($attachemnts)>0)
            //     $responseData['attachemnts'] = $attachemnts; 
            $responseData['data'] = $data[0]; 
            $responseData['uploadPath'] = "/uploadFolder/original/"; 

            
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     
}


  //---like lesson
  public function likeLesson(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

        
        $sql[0]="insert into likes (`userId`,`lessonId`,`like`) values(:userId,:lessonId,:like)";
        $sql[1] ="UPDATE lessons SET lessonLikes = lessonLikes + 1  where lessonId =:lessonId";

        $responseData = array();
      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->bindParam(':userId',$inputs['userId']);
            $sth->bindParam(':lessonId',$inputs['lessonId']);
            $sth->bindParam(':like',$inputs['like']);
            $sth->execute();
                //----Update likes count----
            $sth = $this->db->prepare($sql[1]);
            $sth->bindParam(':lessonId',$inputs['lessonId']);
            $sth->execute();
            $responseData['error'] = false; 

        
            }
      catch (\PDOException $e) {
        
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
   
}


 //---delete like lesson
  public function deleteLikeLesson(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

        
        $sql[0]="delete from likes where userId=:userId and lessonId=:lessonId";
        $sql[1] ="UPDATE lessons SET lessonLikes = lessonLikes - 1  where lessonId =:lessonId";

        $responseData = array();
      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->bindParam(':userId',$inputs['userId']);
            $sth->bindParam(':lessonId',$inputs['lessonId']);
            $sth->execute();
                //----Update likes count----
            $sth = $this->db->prepare($sql[1]);
            $sth->bindParam(':lessonId',$inputs['lessonId']);
            $sth->execute();
            $responseData['error'] = false; 

        
            }
      catch (\PDOException $e) {
        

            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       
      return $this->response->withJson($responseData);
   
}



 
  //---update lesson to like
  public function updateToLike(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

        
        $sql[0]="Updtae likes set like=:like where  userId=:userId and lessonId=:lessonId";
        $sql[1] ="UPDATE lessons SET lessonLikes = lessonLikes + 1  where lessonId =:lessonId";

        $responseData = array();
      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->bindParam(':userId',$inputs['userId']);
            $sth->bindParam(':lessonId',$inputs['lessonId']);
            $sth->bindParam(':like',$inputs['like']);
            $sth->execute();
                //----Update likes count----
            $sth = $this->db->prepare($sql[1]);
            $sth->bindParam(':lessonId',$inputs['lessonId']);
            $sth->execute();
            $responseData['error'] = false; 

            }
      catch (\PDOException $e) {
        
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
   
}



 //---dislike lesson
  public function disLikeLesson(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

        
        $sql[0]="insert into likes (`userId`,`lessonId`,`like`) values(:userId,:lessonId,:like)";
        $sql[1] ="UPDATE lessons SET lessonDislikes = lessonDislikes + 1  where lessonId =:lessonId";

        $responseData = array();
      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->bindParam(':userId',$inputs['userId']);
            $sth->bindParam(':lessonId',$inputs['lessonId']);
            $sth->bindParam(':like',$inputs['like']);
            $sth->execute();
                //----Update likes count----
            $sth = $this->db->prepare($sql[1]);
            $sth->bindParam(':lessonId',$inputs['lessonId']);
            $sth->execute();
            $responseData['error'] = false; 

        
            }
      catch (\PDOException $e) {
        
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
   
}


 //---delete dislike lesson
  public function deleteDislikeLesson(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

        
        $sql[0]="delete from likes where userId=:userId and lessonId=:lessonId";
        $sql[1] ="UPDATE lessons SET lessonDislikes = lessonDislikes - 1  where lessonId =:lessonId";

        $responseData = array();
      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->bindParam(':userId',$inputs['userId']);
            $sth->bindParam(':lessonId',$inputs['lessonId']);
            $sth->execute();
                //----Update likes count----
            $sth = $this->db->prepare($sql[1]);
            $sth->bindParam(':lessonId',$inputs['lessonId']);
            $sth->execute();
            $responseData['error'] = false; 

            }
      catch (\PDOException $e) {
        
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       
      return $this->response->withJson($responseData);
   
}



 
  //---update lesson to dislike
  public function updateToDislike(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

        
        $sql[0]="Updtae likes set like=:like where  userId=:userId and lessonId=:lessonId";
        $sql[1] ="UPDATE lessons SET lessonDislikes = lessonDislikes + 1  where lessonId =:lessonId";

        $responseData = array();
      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->bindParam(':userId',$inputs['userId']);
            $sth->bindParam(':lessonId',$inputs['lessonId']);
            $sth->bindParam(':like',$inputs['like']);
            $sth->execute();
                //----Update likes count----
            $sth = $this->db->prepare($sql[1]);
            $sth->bindParam(':lessonId',$inputs['lessonId']);
            $sth->execute();
            $responseData['error'] = false; 

        
            }
      catch (\PDOException $e) {
        
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
   
}


//---rate lesson
  public function addRate(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

        
        $sql="insert into lessonsComments (`comUserId`,`comDetails`,`comLessonId`,`rateValue`) values(:comUserId,:comDetails,:comLessonId,:rateValue)";


        $responseData = array();
      try{
            $sth = $this->db->prepare($sql);
            $sth->bindParam(':comUserId',$inputs['comUserId']);
            $sth->bindParam(':comDetails',$inputs['comDetails']);
            $sth->bindParam(':comLessonId',$inputs['comLessonId']);
            $sth->bindParam(':rateValue',$inputs['rateValue']);
            $sth->execute();
            $responseData['error'] = false; 
        
            }
      catch (\PDOException $e) {
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
   
}


 //---get lesson rates
  public function getLessonRates(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        
        $lessonId = $args['lessonId'];
        $userId = $args['userId'];

        $result=array();

            
        $sql="select lessonsComments.comDetails,lessonsComments.comDateTime,
	    lessonsComments.rateValue,users.userName,users.userImage
        from lessonsComments INNER JOIN users ON lessonsComments.comUserId = users.userId where comLessonId=$lessonId";
        $responseData = array();
      try{
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $data = $sth->fetchAll();
            $responseData['error'] = false; 
            $responseData['rowsCount']= sizeof($data);
            $responseData['data'] = $data; 
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}



//---get files 
  public function getLessonAttach(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        
        $lessonId = $args['lessonId'];
        $result=array();

            
        $sql="select * from lessonAttach where lessonAttachLesson=$lessonId order by lessonAttachId desc";
        $responseData = array();
      try{
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $data = $sth->fetchAll();
            $responseData['error'] = false; 
            $responseData['rowsCount']= sizeof($data);
            $responseData['data'] = $data; 
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }

      return $this->response->withJson($responseData);
     
}


//---get user details
  public function getUserDetails(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        
        $userId = $args['userId'];
        $result=array();

            
        $sql="select * from users where userId=$userId";
        $responseData = array();
      try{
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $data = $sth->fetchAll();
            $responseData['error'] = false; 
            $responseData['rowsCount']= sizeof($data);
            $responseData['data'] = $data[0]; 
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }

      return $this->response->withJson($responseData);
     
}

//---update userpassword
  public function updatePassword(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

        $sql="update users set usePW =:password where userId=:userId"; 
       
        $responseData = array();
        try
            {
            $sth = $this->db->prepare($sql);
            $sth->bindParam(':password',$inputs['password']);
            $sth->bindParam(':userId',$inputs['userId']);
            $sth->execute();
            $responseData['error'] = false; 
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
   
}


//---change userpassword
  public function changePassword(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

        $sql="update users set usePW =:newPassword where userId =:userId and usePW =:oldPassword"; 
       
        $responseData = array();
        try
            {
            $sth = $this->db->prepare($sql);
            $sth->bindParam(':newPassword',$inputs['newPassword']);
            $sth->bindParam(':oldPassword',$inputs['oldPassword']);
            $sth->bindParam(':userId',$inputs['userId']);
            $sth->execute();
            $responseData['error'] = false; 
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
   
}


//---get lesson comments
  public function lessonComments(Request $request, Response $response, $args)
{
        $this->request=$request;
        $this->response=$response;
        
        $lessonId = $args['lessonId'];
        $offset = $args['offset'];
        $result=array();

        if($offset==1){
            $sql="select lessonsComments.comId,lessonsComments.comDetails,lessonsComments.comDateTime,
	    lessonsComments.rateValue,users.userName,users.userImage
        from lessonsComments INNER JOIN users ON lessonsComments.comUserId = users.userId where comLessonId=$lessonId ORDER BY lessonsComments.comId DESC LIMIT 5 ";
    
        }else{
            $offset = ($args['offset']*5)-5;
            $sql="select lessonsComments.comId,lessonsComments.comDetails,lessonsComments.comDateTime,
	    lessonsComments.rateValue,users.userName,users.userImage
        from lessonsComments INNER JOIN users ON lessonsComments.comUserId = users.userId where comLessonId=$lessonId ORDER BY lessonsComments.comId DESC LIMIT 5  OFFSET $offset";
        }
            

        $responseData = array();
      try{
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $data = $sth->fetchAll();
            $responseData['error'] = false; 
            $responseData['rowsCount']= sizeof($data);
            $responseData['data'] = $data; 
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}



/*
  //---Meeting overtime alarm
  public function sendOvertimeAlarm(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();

        $result=array();

          $sql="select importerId,exporterId ,companies1.token as token1,companies2.token as token2,meetingStartDateTime,
DATE_ADD(meetingStartDateTime, INTERVAL eventMeetingTime MINUTE) as endTime ,DATE_ADD(NOW(),INTERVAL 5 MINUTE) as nn

from meetings inner join companies as companies1 inner join companies as companies2 inner join events 
on meetings.importerId=companies1.id and meetings.exporterId = companies2.id and meetings.eventId=events.id
where meetingStatus=1  and DATE_ADD(NOW(),INTERVAL 5 MINUTE) >= DATE_ADD(meetingStartDateTime, INTERVAL eventMeetingTime MINUTE) ";
 
// echo $sql;
      $sth = $this->db->prepare($sql);
      try{
            $sth->execute();
            $data = $sth->fetchAll();
            if(sizeof($data)>0) //available meeting
                {
 
  
                //---Send Notification to both 
                $notificaionsTokens=array();
                $j=0;
                for($i=0;$i<sizeof($data);$i++)
                {
                    $notificaionsTokens[$j]=$data[$i]['token1'];
                    $j++;
                    $notificaionsTokens[$j]=$data[$i]['token2'];
                    $j++;
                }
                Print_r($notificaionsTokens);
                $message="Please close your current meeting asap";
                $title="Meeting alarm";
                $args=array();
                $args['message']=$message;
                $args['title']=$title;
                $args['notificaionsTokens']=$notificaionsTokens;
                
                $this->sendNotification( $request,  $response, $args);
                
                }
           
        
            }
      catch (\PDOException $e) {
        
            echo "Error".$e;
            }
      
       



   
}


  //---contactUs
  public function contactUs(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $result=array();  

        $mail = new PHPMailer(true);
     
        $email = $inputs['email'];
        $message = $inputs['message'];
                try{

                    $mail->SMTPDebug = 0;                                 
                    $mail->isSMTP();                                      
                    $mail->Host = 'smtp.gmail.com';  
                    $mail->SMTPAuth = true;                               
                    $mail->Username = 'b2bapp2019@gmail.com';                 
                    $mail->Password = 'B29zSxmV8';                          
                    $mail->SMTPSecure = 'tls';                            
                    $mail->Port = 587;
                    
                    $mail->setFrom('b2bapp2019@gmail.com', 'B2B');
                    $mail->addAddress('hashem@i-b2b.co');

                    $mail->isHTML(true); //send email in html formart
                    $mail->Subject = 'B2B ,Contact us message';
                    $mail->Body    = "$email<br> $message";
 
               
                  $mail->send();
                    $responseData['error'] = false; 

        }
 
           
            catch (Exception $e) {
                $error = $mail->ErrorInfo;
                $responseData['error'] = true; 
            }    
          
         return $this->response->withJson($responseData);
     


   
}
    //---Forgot Password
  public function forgotPassword(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $result=array();  

        $mail = new PHPMailer(true);
     
        $email = $args['email'];
        $type = $args['type'];
        $verificationCode=mt_rand(1000, 9999);
 if($type==1)//Company
     $sql="select id from companies where loginEmail = '$email'";
 else //Organizer
      $sql="select id from organizers where organizerEmail = '$email'";
         
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $data=$sth->fetchAll(); 
            //$responseData['data'] = $data; 
            if(sizeof($data)==1)//user found
                {
                try{

                    $mail->SMTPDebug = 0;                                 
                    $mail->isSMTP();                                      
                    $mail->Host = 'smtp.gmail.com';  
                    $mail->SMTPAuth = true;                               
                    $mail->Username = 'b2bapp2019@gmail.com';                 
                    $mail->Password = 'B29zSxmV8';                          
                    $mail->SMTPSecure = 'tls';                            
                    $mail->Port = 587;
                    $mail->setFrom('b2bapp2019@gmail.com', 'Forgot password');
                    $mail->addAddress($email);

                    $mail->isHTML(true); //send email in html formart
                    $mail->Subject = 'B2B ,Your Verofication Code';
                    $mail->Body    = "<h1>Please use this code to verify your account : $verificationCode </h1> ";
 
               
                  $mail->send();
            }
            catch (Exception $e) {
                $error = $mail->ErrorInfo;
                echo $error;
            }    
            $responseData['error'] = false; 
            $responseData['verificationKey'] = md5($data[0]['id'].$verificationCode); 
          
         }
           
    else
        {
        $responseData['error'] = true; 

        }
 

        return $this->response->withJson($responseData);
      


   
}

  //---change Password
  public function changePassword(Request $request, Response $response, $args)
{
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $result=array();  

     
        $email = $inputs['email'];
        $type = $inputs['type'];
        $password = $inputs['password'];
        $verificationCode = $inputs['verificationCode'];
        $verificationKey = $inputs['verificationKey'];
        
        if($type==1)//Company
             $sql="select id from companies where loginEmail = '$email'";
        else //Organizer
            $sql="select id from organizers where organizerEmail = '$email'";
         
        $sth = $this->db->prepare($sql);
        $sth->execute();
        $data=$sth->fetchAll(); 
        
        $responseData = array();

        if(sizeof($data)==1)//user found
            {
            if( md5($data[0]['id'].$verificationCode) == $verificationKey)//correct key-Update password
                {
                if($type==1)//Company
                    $sql="update companies set loginPassword ='$password' where loginEmail = '$email'";
                else //Organizer
                    $sql="update organizers set organizerPassword ='$password' where organizerEmail = '$email'";
                    
                $sth = $this->db->prepare($sql);
                $sth->execute();
                $responseData['error'] = false; 
                }
            else
                {
                $responseData['error'] = true; 
                $responseData['errorCode'] = '1';//wrong verification 
                $responseData['errorreason'] = 'wrong verification';//

                }
            }
        else
            {
            $responseData['error'] = true; 
            $responseData['errorCode'] = '2';//wrong verification 
            $responseData['errorreason'] = 'wrong email';//
            }
 
 

        return $this->response->withJson($responseData);
      


   
}

    //---Get events
  public function getEvents(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $page=$args['page'];

        $result=array();
       

        $sql="select *,if(eventStartDate<current_date(),1,0) as eventStared from events where eventDeleteFlag!=1 order by eventStartDate desc  limit ".$page*10 .",10";
      
        $responseData = array();

      
      try{
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $data = $sth->fetchAll();
            
            $responseData['error'] = false; 
            $responseData['rowsCount'] = sizeof($data);
            $responseData['data'] = $data; 
          


            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
       
       

      return $this->response->withJson($responseData);
     

   
}

 //---assistanceRequest
  public function assistanceRequest(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $result=array();
        
        $message=$inputs['message'];
        $token=$inputs['token'];
        $companyName=$inputs['companyName'];
        $companyTable=$inputs['companyTable'];
        $organizerId=$inputs['organizerId'];
        $eventId=$inputs['eventId'];
        $companyId=$inputs['companyId'];

          //---Send Notification to organizer 
                $notificaionsTokens=array();
                $notificaionsTokens[0]=$token;
                $title="You have a request from  $companyName on Table [$companyTable]";
                $args=array();
                $args['message']=$message;
                $args['title']=$title;
                $args['notificaionsTokens']=$notificaionsTokens;

                
                $this->sendNotification( $request,  $response, $args);
                
                $sql="insert into assistanceRequests (eventId,companyId,tableNo,message,organizerId,requestDateTime,companyName) values ";
                $sql.="($eventId,$companyId,$companyTable,'$message',$organizerId,NOW(),'$companyName')";
          try{
            $sth = $this->db->prepare($sql);
            $sth->execute();
          
            $responseData['error'] = false; 

            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
       
       

      return $this->response->withJson($responseData);
        
       
   
}



      //---Get Organizer Notifications
  public function getOrganizerNotifications(Request $request, Response $response, $args)
{
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
     
        $result=array();
        $organizerId = $args['organizerId'];
        $page=$args['page'];
        $sql="select * from assistanceRequests where organizerId=$organizerId order by id asc limit ".$page*10 .",10";  
        
        $responseData = array();

      
      try{
            $sth = $this->db->prepare($sql);
            $sth->execute();
          
            $responseData['data'] = $sth->fetchAll();  
            $responseData['error'] = false; 

            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
       
       

      return $this->response->withJson($responseData);
     
   
} 

      //---Get activeEvent
  public function getActiveEvent(Request $request, Response $response, $args)
{
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
     
        $sql=array();
        $result=array();
        $companyId = $args['companyId'];

        $sql[0]="select events.id as eventId,evnentTableSetting,feedbackAnswered ,tableNum as tableNumber from events inner join requests on events.id=requests.eventId where requests.companyId=$companyId ";
        $sql[0].="and events.eventEndDate >=current_date() and requests.requestStatus=2 and events.eventDeleteFlag!=1 order by events.eventEndDate limit 1 ";



         $responseData = array();

      
      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->execute();
          
            $responseData['data'] = $sth->fetchAll();  
            $responseData['error'] = false; 

            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
       
       

      return $this->response->withJson($responseData);
     
   
} 
  //---Get EventFeedback questions and answers
  public function getEventFeedbackData(Request $request, Response $response, $args)
{
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
     
        $sql=array();
        $result=array();
        $eventId = $args['eventId'];
        $companyType = $args['companyType'];

        $sql[0]="select * from feedbackQuestions where eventId = $eventId and ( exporterImporter= 0 or exporterImporter = $companyType ) ";
        $sql[1]="select * from answerType";
        

         $responseData = array();

      
      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->execute();
            $responseData['questions'] = $sth->fetchAll();

            $sth = $this->db->prepare($sql[1]);
            $sth->execute();
            $responseData['answers'] = $sth->fetchAll();  
            $responseData['error'] = false; 

            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
       
       

      return $this->response->withJson($responseData);
     
   
}
  //---Add EventFeedback 
  public function addEventFeedback(Request $request, Response $response, $args)
{
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $answersString=$inputs['answers'];
        
        $sql=array();
        $result=array();
        $eventId = $args['eventId'];
        $companyId = $args['companyId'];

        $sql[0]="insert into eventFeedback (eventId,companyId,questionId,feedbackAnswer) values ";
        $str="";
        
        $answersArray=explode(",",$answersString);
        
        for( $i=0;$i<sizeof($answersArray);$i++)
            {
                if($i!=0) $str.=",";
                $question=explode(":",$answersArray[$i]);
                $str.="($eventId ,$companyId,$question[0],$question[1])";
                
            }
        $sql[0].=$str;
    
        $sql[1]="update requests set feedbackAnswered=1 where eventId=$eventId and companyId=$companyId" ;  

         $responseData = array();

      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->execute();
            $sth = $this->db->prepare($sql[1]);
            $sth->execute();
            $responseData['error'] = false; 
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
       
       

      return $this->response->withJson($responseData);
     
   
}

    //---Get Organizer meettings
  public function getOrganizerMeetings(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;

        $sql=array();
        $result=array();
        $organizerId = $args['organizerId'];
        $selectedDate = $args['selectedDate'];

        $sql[0]="select meetings.id as meetingID,meetingTable,importerId,exporterId,meetingPlannedDate,meetingStatus,importres.companyName as ";
        $sql[0].=" importerName,importres.available as importerAvailable ,importres.companyLogo as importerLogo,exporters.companyName ";
        $sql[0].=" as exporterName,exporters.available as exporterAvailable ,exporters.companyLogo as exporterLogo,meetingStartDateTime,meetingPlanedTime,";
        $sql[0].="if(meetingStartDateTime,meetingStartDateTime,meetingPlanedTime )as meetingStart,if(meetingStartDateTime,DATE_ADD(meetingStartDateTime,";
        $sql[0].="INTERVAL eventMeetingTime MINUTE),DATE_ADD(meetingPlanedTime, INTERVAL eventMeetingTime MINUTE))";
        $sql[0].="as meetingEnd,if(if(meetingStartDateTime,DATE_ADD(meetingStartDateTime, INTERVAL eventMeetingTime MINUTE),DATE_ADD(meetingPlanedTime,";
        $sql[0].="INTERVAL eventMeetingTime MINUTE))<NOW() && meetingStatus=1 ,1,0) endWarning , organizerNote ,organizerFeedBack ";
        $sql[0].=" from meetings inner join companies as importres inner join companies as exporters inner join events ";
        $sql[0].=" on meetings.importerId=importres.id and meetings.exporterId=exporters.id and meetings.eventId = events.id ";
        $sql[0].=" where meetingPlannedDate='$selectedDate'  and organizerId=$organizerId";
        $sql[0].=" order by importerName asc";


        $sql[1]="select distinct companyName  from meetings inner join companies ";
        $sql[1].="on meetings.importerId=companies.id  where meetingPlannedDate>=current_date()-10  and organizerId=$organizerId order by companyName asc";
        $sql[2]="select distinct companyName  from meetings inner join companies ";
        $sql[2].="on meetings.exporterId=companies.id  where meetingPlannedDate>=current_date()-10  and organizerId=$organizerId order by companyName asc";

        $sql[3]="select distinct meetingPlannedDate as days from meetings where organizerId=$organizerId and meetingPlannedDate>=current_date()-10 order by meetingPlannedDate asc";

        

      // echo $sql[0];
        $responseData = array();

     
      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->execute();
            $data = $sth->fetchAll();
            
            $responseData['error'] = false; 
            $responseData['data'] = $data; 
          
            $sth = $this->db->prepare($sql[1]);
            $sth->execute();
            $data = $sth->fetchAll();
            
            $sth = $this->db->prepare($sql[2]);
            $sth->execute();
            $data1 = $sth->fetchAll();
            $data=array_merge($data,$data1);

            $responseData['companies'] = $data; 
            
            $sth = $this->db->prepare($sql[3]);
            $sth->execute();
            $data = $sth->fetchAll();
            $responseData['days'] = $data; 


 
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}

    //---Get company meettings
  public function getCompanyMeetings(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();
        $companyID = $args['companyID'];
        $companytype = $args['companytype'];
        if($companytype==1)
            {
            $firstPart="exporterId";
            $secondPart="importerId";
            }
        else
            {
            $firstPart="importerId";
            $secondPart="exporterId";
            }
            
            $sql[0]="select meetings.id as meetingId,$firstPart as otherId,companies.companyName as otherName,eventId,meetingPlannedDate,meetingTable,";
            $sql[0].="meetingStatus,companies.companyDescription,companyLogo,countryId,countries.name as country,companyProductsIds,companyProductsCats,";
            $sql[0].="companyAddress ,
if(meetingStartDateTime,meetingStartDateTime,meetingPlanedTime )as meetingStart,if(meetingStartDateTime,DATE_ADD(meetingStartDateTime,
INTERVAL eventMeetingTime MINUTE),DATE_ADD(meetingPlanedTime, INTERVAL eventMeetingTime MINUTE))
as meetingEnd,if(if(meetingStartDateTime,DATE_ADD(meetingStartDateTime, INTERVAL eventMeetingTime MINUTE),DATE_ADD(meetingPlanedTime,
INTERVAL eventMeetingTime MINUTE))<NOW() && meetingStatus=1 ,1,0) endWarning , ";
            if($companytype==1)
                $sql[0].=" importerNote as Note,importerExpectedDeals as ExpectedDeals,importerExpectedDealsValue as ExpectedDealsValue ,importerMeetingFeedback as meetingFeedback";

          else
                $sql[0].=" exporterNote as Note,exporterExpectedDeals as ExpectedDeals,exporterExpectedDealsValue as ExpectedDealsValue,exporterMeetingFeedback as meetingFeedback";

          
            $sql[0].=" from meetings inner join companies inner join countries inner join events on meetings.$firstPart=companies.id  and ";
            $sql[0].="companies.countryId=countries.id and meetings.eventId=events.id  where $secondPart=$companyID and meetingPlannedDate>=current_date()-10 order by ";
            $sql[0].="meetingPlannedDate asc";
         
            $sql[1]="select distinct meetingPlannedDate as days from meetings where $secondPart=$companyID and meetingPlannedDate>=current_date()-10 order by meetingPlannedDate asc";
       
        

      // echo $sql[0];
        $responseData = array();

      for( $i=0;$i<sizeof($sql);$i++)
      {
      $sth = $this->db->prepare($sql[$i]);
      try{
            $sth->execute();
            $data = $sth->fetchAll();
            
            $responseData['error'] = false; 
          if($i==0) $responseData['rowsCount'] = sizeof($data);
            if($i==0)$responseData['data'] = $data; 
            if($i==1)$responseData['days'] = $data; 


            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      }
       

      return $this->response->withJson($responseData);
     

   
}


    //---Get visitors
  public function getVisitors(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
     
        $sql=array();
        $result=array();
        $companyId = $args['companyId'];
        $page = $args['page'];

        $sql[0]="select events.id as id,evnentTableSetting  from events inner join requests on events.id=requests.eventId where requests.requestStatus=2 and requests.companyId=$companyId ";
        $sql[0].="and events.eventEndDate >=current_date() and events.eventDeleteFlag!=1";
        
        $sql[1]="select companyProductsIds,companyType from companies where id=$companyId";
        
        $sql[2]="select  visitors.id, visitors.companyName,countries.name as country_name, visitors.companyProductsIds,companyProductsCats,"; 
        $sql[2].="visitors.contactName, visitors.contactPosition, visitors.contactMobile from visitors ";
        $sql[2].="inner join countries  on visitors.countryId = countries.id ";
        $sql[2].="where visitors.eventId=:ev and (";

      // echo $sql[0];
      // echo $sql[1];
      // echo $sql[2];

        $responseData = array();

      
      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->execute();
            $data = $sth->fetchAll();
            $eventId=$data[0]['id'];
            $evnentTableSetting=$data[0]['evnentTableSetting'];
            
            $sth = $this->db->prepare($sql[1]);
            $sth->execute();
            $data = $sth->fetchAll();        
            $companyType=$data[0]['companyType'];
            if($companyType==2)
            {
                $productsArray  = explode(",", $data[0]['companyProductsIds']);
                $productsCount=0;
                foreach ($productsArray as $product) 
                    {
                        if($productsCount==1) $sql[2].=" or ";
                        $sql[2].="  FIND_IN_SET(".$product.",visitors.companyProductsIds)";
                        $productsCount=1;
                    }
                $sql[2].=") limit ".$page*10 .",10";  
              
                $sth = $this->db->prepare($sql[2]);
                $sth->bindParam(':ev',$eventId);
                $sth->execute();
                $data = $sth->fetchAll();        
                $responseData['data'] = $data; 
            }

            $responseData['error'] = false; 

            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
       
       

      return $this->response->withJson($responseData);
     

   
}


  //---Get organizer data
  public function getMyOrganizer(Request $request, Response $response, $args)
{
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
     
        $sql=array();
        $result=array();
        $companyId = $args['companyId'];

        $sql[0]="select events.id as id  from events inner join requests on events.id=requests.eventId where requests.companyId=$companyId ";
        $sql[0].="and events.eventEndDate >=current_date() and requestStatus=2 and events.eventDeleteFlag!=1";
        
        $sql[1]="select organizers.id as organizerId,organizers.organizerName,organizerMobile,organizerImage,organizerEmail,token from requests inner join organizers on requests.organizerId = organizers.id where companyId=$companyId and eventId=";
        
         $responseData = array();

      
      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->execute();
            $data = $sth->fetchAll();
            $eventId=$data[0]['id'];

            $sql[1].=$eventId;
            $sth = $this->db->prepare($sql[1]);
            $sth->execute();
            $data = $sth->fetchAll();        
            $responseData['data'] = $data; 
            $responseData['error'] = false; 

            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
       
       

      return $this->response->withJson($responseData);
     
   
}



  //---Get Certail meeting for notifications 
  public function getCertainMeeting(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $result=array();
        
        $meetingId = $args['meetingID'];
        $companytype = $args['companytype'];

        if($companytype==1)
            {
            $firstPart="exporterId";
            $secondPart="importerId";
            }
        else
            {
            $firstPart="importerId";
            $secondPart="exporterId";
            }
            
            $sql="select meetings.id as meetingId,$firstPart as otherId,companies.companyName as otherName,companyProductsCats,eventId,meetingPlannedDate,meetingTable,meetingStatus,companies.companyDescription,companyLogo,countryId,countries.name as country,companyProductsIds,companyAddress from meetings inner join companies inner join countries on meetings.$firstPart=companies.id  and companies.countryId=countries.id where meetings.id=$meetingId ";
        

     //  echo $sql;
        $responseData = array();

     
      $sth = $this->db->prepare($sql);
      try{
            $sth->execute();
            $data = $sth->fetchAll();
            
            $responseData['error'] = false; 
          $responseData['rowsCount'] = sizeof($data);
            $responseData['data'] = $data; 

            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
       
       

      return $this->response->withJson($responseData);
     

   
}



  //---company Login and update Token
  public function companyLogin(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

            
            $sql[0]="select * from companies where loginEmail='".$inputs['loginEmail']."' and loginPassword='".$inputs['loginPassword'] ."'";
         
            $sql[1]="update companies set token='".$inputs['token']."' where id=:id";
            
            $sql[2]="select events.id as id,evnentTableSetting  from events inner join requests on events.id=requests.eventId where requests.companyId=:id ";
            $sql[2].="and events.eventEndDate >=current_date() and events.eventDeleteFlag!=1";
  
        

      // echo $sql[0];
        $responseData = array();

      $sth = $this->db->prepare($sql[0]);
      try{
            $sth->execute();
            $data = $sth->fetchAll();
            if(sizeof($data)>0) //success login
                {
                $responseData['error'] = false; 
                $responseData['rowsCount'] = sizeof($data);
                $responseData['data'] = $data; 
                //----Update token----
                $id=$data[0]['id'];
                $sth = $this->db->prepare($sql[1]);
                $sth->bindParam(':id',$id);
                $sth->execute();
                //----Get active event
                $sth = $this->db->prepare($sql[2]);
                $sth->bindParam(':id',$id);
                $sth->execute();
                $event = $sth->fetchAll();
                if($event[0]['id'])
                    $responseData['activeEvent']=$event[0]['id'];
                else
                    $responseData['activeEvent']=null;
        
                }
            else
                {
                $responseData['error'] = false; 
                $responseData['rowsCount'] = 0;
                $responseData['data'] = [];
                }
        
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}

//------------------------    
  //---organizer Login and update Token
  public function organizerLogin(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();

            
            $sql[0]="select * from organizers where organizerEmail='".$inputs['loginEmail']."' and organizerPassword='".$inputs['loginPassword'] ."'";
         
            $sql[1]="update organizers set token='".$inputs['token']."' where id=:id";
       
        

      // echo $sql[0];
        $responseData = array();

      $sth = $this->db->prepare($sql[0]);
      try{
            $sth->execute();
            $data = $sth->fetchAll();
            if(sizeof($data)>0) //success login
                {
                $responseData['error'] = false; 
                $responseData['rowsCount'] = sizeof($data);
                $responseData['data'] = $data; 
                //----Update token----
                $id=$data[0]['id'];
                $sth = $this->db->prepare($sql[1]);
                $sth->bindParam(':id',$id);
                $sth->execute();
                }
            else
                {
                $responseData['error'] = false; 
                $responseData['rowsCount'] = 0;
                $responseData['data'] = [];
                }
        
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}

  //---Open meeting
  public function startMeeting(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();
        $meetingId=$args['meetingId'];
        $tableNum=$args['tableNum'];
        
          $sql[0]="select meetings.id as meetingID,importerId,exporterId,meetingPlannedDate,meetingStatus,importres.companyName as importerName,importres.available as importerAvailable ,importres.companyLogo as importerLogo,exporters.companyName as exporterName,exporters.available as exporterAvailable ,exporters.companyLogo as exporterLogo,exporters.token as exporterToken,importres.token as importerToken
                from meetings inner join companies as importres inner join companies as exporters
                on meetings.importerId=importres.id and meetings.exporterId=exporters.id
                where meetings.id=".$meetingId." and exporters.available=1 and importres.available=1";
            
            $sql[1]="update companies set available=0 where id in(:imId,:exID)";       
            $sql[2]="update meetings set meetingStartDateTime=now() ,meetingStatus=1,meetingTable=$tableNum where meetings.id=$meetingId";

            $sql[3]="insert into notifications (notificationDateTime,title,eventId,companyId) values (now(),'You have meeting now on Table no $tableNum',$meetingId,:imId),
                (now(),'You have mmeting now on Table no $tableNum',$meetingId,:exID)";      

      // echo $sql[0];
        $responseData = array();

      $sth = $this->db->prepare($sql[0]);
      try{
            $sth->execute();
            $data = $sth->fetchAll();
            if(sizeof($data)>0) //available meeting
                {
                $responseData['error'] = false; 
                //----Update avilable----
                $importerId=$data[0]['importerId'];
                $exporterId=$data[0]['exporterId'];
                $importerToken=$data[0]['importerToken'];
                $exporterToken=$data[0]['exporterToken'];

                $sth = $this->db->prepare($sql[1]);
                $sth->bindParam(':imId',$importerId);
                $sth->bindParam(':exID',$exporterId);
                $sth->execute();
                //----Update Meeting----
                $sth = $this->db->prepare($sql[2]);
                $sth->execute();
               

            
                //---insert Notification to both
                $sth = $this->db->prepare($sql[3]);
                $sth->bindParam(':imId',$importerId);
                $sth->bindParam(':exID',$exporterId);
                $sth->execute();
  
                //---Send Notification to both 
                $notificaionsTokens=array();
                $notificaionsTokens[0]=$importerToken;
                $notificaionsTokens[1]=$exporterToken;
                $message="You have mmeting now on Table no $tableNum";
                $title="New meeting";
                $args=array();
                $args['message']=$message;
                $args['title']=$title;
                $args['notificaionsTokens']=$notificaionsTokens;
                $args['meetingId']=$meetingId;

                
                $this->sendNotification( $request,  $response, $args);
                
                }
            else//Meeting is not available to start
                {
                $responseData['error'] = true; 
                $responseData['rowsCount'] = 0;
                $responseData['data'] = [];
                }
        
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}

  //---Close meeting
  public function closeMeeting(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        
        $result=array();
        $meetingId=$inputs['meetingId'];
        $companyId=$inputs['companyId'];

        $forceClose=$inputs['forceClose'];
        $closerId=$inputs['closerId'];
        $companyId1=$inputs['companyId1'];
        $companyId2=$inputs['companyId2'];


        
        if($inputs['importerExpectedDeals'])
        {
            $expetedDeals=$inputs['importerExpectedDeals'];
            $expetedDealsValue=$inputs['importerExpectedDealsValue'];
            $meetingFeedback=$inputs['importerMeetingFeedback'];
        
          $sql[0]="update meetings set importerExpectedDeals=:v1,importerExpectedDealsValue=:v2,importerMeetingFeedback=:v3,meetingStatus=2,meetingEndDateTime = if(meetingEndDateTime,meetingEndDateTime,now()) where id=:v4 ";
        }
        if($inputs['exporterExpectedDeals'])
        {
            $expetedDeals=$inputs['exporterExpectedDeals'];
            $expetedDealsValue=$inputs['exporterExpectedDealsValue'];
            $meetingFeedback=$inputs['exporterMeetingFeedback'];

            $sql[0]="update meetings set exporterExpectedDeals=:v1,exporterExpectedDealsValue=:v2,exporterMeetingFeedback=:v3,meetingStatus=2,meetingEndDateTime = if(meetingEndDateTime,meetingEndDateTime,now()) where id=:v4 ";

        }
        $sql[1]="update companies set available=1 where id=$companyId";
      //For force close only
        $sql[2]="update companies set available=1 where id in($companyId1,$companyId2)";
        $sql[3]="update meetings set meetingStatus=2,meetingEndDateTime=now(),forceClose=$closerId where id=$meetingId";

        $responseData = array();

      try{
          if(!$forceClose)
          {
            $sth = $this->db->prepare($sql[0]);
            $sth->bindParam(':v1',$expetedDeals);
            $sth->bindParam(':v2',$expetedDealsValue);
            $sth->bindParam(':v3',$meetingFeedback);
            $sth->bindParam(':v4',$meetingId);

            $sth->execute();
            $sth = $this->db->prepare($sql[1]);
            $sth->execute();
          }
          else
          {
            $sth = $this->db->prepare($sql[2]);
            $sth->execute();
            $sth = $this->db->prepare($sql[3]);
            $sth->execute();
          }
            $responseData['error'] = false; 

                
            
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}



//----Send Notification--
function sendNotification(Request $request, Response $response, $args)
    {
    define( 'API_ACCESS_KEY', 'AAAAljFJdik:APA91bE0-NUfjG7-FdyfQ6k96Dzp0PmILYf6DWQu6zAvhUFED4tZoRIgHz3sQCqdTFmkIjrDaoN_htxZNnMaodFj7G0bIFMJ0-buSvS3HXv1Z2JuuNxGc19djAGYmTeSnF7W1RUmHNUa' );
  // $registrationIds = array( 'cDoh0YVcbEQ:APA91bG8I6s2l_P48aNaAx_jHnDDu6tvn2gMgrNFws89jQal9T0i1BxOZ6BTlA67bIVWy3W9crplODzSFPPFk21NdxUF_7pxqYPe1PQJ-vhXfGb2ZhjvAR7y_ZgSAu9e19vihbZ9tmQE' );
  
        $message=$args['message'];
        $title=$args['title'];
        $notificaionsTokens=$args['notificaionsTokens'];
        $meetingId= $args['meetingId'];

      //-------Test notification Direct--------
        if(sizeof($notificaionsTokens)==0)
                $notificaionsTokens[0]='f0VEEmABKvg:APA91bGhFvvvtKLa33Dz1NeGPcT-Br7BuRaoTv8g2RwLqHq2pwYe2M8cZyTGXfQ5HEVIEF3e-QGt6XgRYpa2N0RiX1dBZnS84XLbbaPs4iF4L-6GPQE-MeKnaj7wMxuXbA1Lvb-sOrBC';
        if(!$message) $message="Test notification";
        if(!$title) $title="Test title";
        //------------------
            
    // prep the bundle
    $msg = array
        (
    	'message' 	=> $message,
    	'title'		=> $title,
    	'subtitle'	=> $message,
    	'tickerText'	=> 'Ticker text here...Ticker text here...Ticker text here',
    	'vibrate'	=> 1,
    	'sound'		=> "sound",
    	'largeIcon'	=> 'fcm_push_icon',
    //	'smallIcon'	=> 'fcm_push_icon',
        'smallIcon' => 'res://icon.png',
        'click_action'=>"FCM_PLUGIN_ACTIVITY",  //Must be present for Android

        'meetingId'=>$meetingId,
    	'icon'=> 'fcm_push_icon'

    );
    $fields = array
        (
        	'registration_ids' 	=> $notificaionsTokens,
    	    'data'			=> $msg,
    	    'notification'=>array(
    	                        'message' => $message,
    	                        'title'		=> $title,
    	                        'subtitle'	=> $message,

                                'click_action' => "FCM_PLUGIN_ACTIVITY",
                            'sound'=>'sound',
                            'icon'=> 'fcm_push_icon',
                          //  'image'=> "http://www.androiddeft.com/wp-content/uploads/2017/11/Shared-Preferences-in-Android.png"

                            ),
        'priority'=> "high"
        );
 
    $headers = array
        (
    	'Authorization: key=' . API_ACCESS_KEY,
    	'Content-Type: application/json'
        );
 
    $ch = curl_init();
    curl_setopt( $ch,CURLOPT_URL, 'https://android.googleapis.com/gcm/send' );
    curl_setopt( $ch,CURLOPT_POST, true );
    curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    $result = curl_exec($ch );
    curl_close( $ch );
    echo $result;
    
	}
	
//--------
//-----Organizer meeting Feedback

    public function organizerMeetingFeedback(Request $request, Response $response, $args)
    {
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();
     
        $meetingId = $inputs['meetingId'];
        $organizerFeedBack = $inputs['organizerFeedBack'];
        $organizerNote = $inputs['organizerNote'];
     

        $sql="update meetings set organizerFeedBack='$organizerFeedBack',organizerNote='$organizerNote' where id=$meetingId";
        $responseData = array();

      
      try{
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $responseData['error'] = false; 
                
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}
  //---Company Add note
  public function meetingNote(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();

        $result=array();
        $meetingId=$inputs['meetingId'];
        $companyId=$inputs['companyId'];
        $companyType=$inputs['companyType'];
        $note=$inputs['note'];

        $sql="update meetings set ";
        
        if($inputs['companyType']==1)
            $sql.="importerNote='";
        else
            $sql.="exporterNote='";
        $sql.="$note'";
        $sql.=" where id=$meetingId";
        
      try{
         
           
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $responseData['error'] = false; 
            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}
  //---Assign new meeting
  public function assignNewMeeting(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $inputs=array();
        $inputs = $request->getParsedBody();
        $sql=array();
        $result=array();
        $exporterID = $inputs['exporterID'];
        $importerID = $inputs['importerID'];
        $eventID = $inputs['eventID'];
        $meetingDate = $inputs['meetingDate'];
        $maxDailyMeetings = $inputs['maxDailyMeetings'];
        $organizerId = $inputs['organizerId'];
        $meetingPlanedTime = $inputs['meetingPlanedTime'];
        $meetingTable = $inputs['meetingTable'];


            $sql[0]="select if(count(id),count(id),0) as mCount from meetings where eventId=$eventID and importerId=$importerID and meetingPlannedDate='$meetingDate'";
            $sql[1]="select if(count(id),count(id),0) as mCount from meetings where eventId=$eventID and  exporterId=$exporterID and meetingPlannedDate='$meetingDate'";
            $sql[2]="insert into meetings (eventId,importerId,exporterId,meetingPlannedDate,organizerId,meetingPlanedTime,meetingTable) values(:e,:i,:x,:d,:o,:j,:n)";
        

        

        $responseData = array();

      
      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->execute();
            $data = $sth->fetchAll();
            $imCount=$data[0]['mCount'];
            
            $sth = $this->db->prepare($sql[1]);
            $sth->execute();
            $data = $sth->fetchAll();
            $exCount=$data[0]['mCount'];
            
            if($imCount<$maxDailyMeetings && $exCount<$maxDailyMeetings)//Assign meeting
                {
                    //insert
            $responseData['error'] = false; 
            $responseData['assigned'] = true; 

            $sth = $this->db->prepare($sql[2]);
            $sth->bindParam(':e',$eventID);
            $sth->bindParam(':i',$importerID);
            $sth->bindParam(':x',$exporterID);
            $sth->bindParam(':d',$meetingDate);
            $sth->bindParam(':o',$organizerId);
            $sth->bindParam(':j',$meetingPlanedTime);
            $sth->bindParam(':n',$meetingTable);

            $sth->execute();

                    
                }
            else
            {
              // echo "$imCount"."::"."$exCount";
                $responseData['assigned'] = false; 
                
                $message1="Importer exeed daily allowed meetings ";
                $message2=" Exporter exeed daily allowed meetings ";
                if($imCount>=$maxDailyMeetings )
                    {
                    
                    $responseData['message'] = $message1; 
      
                    }
                if( $exCount>=$maxDailyMeetings)
                    {
                    $responseData['message'] .= $message2; 

                    }
                $responseData['importerMeetings'] = $imCount; 
                $responseData['exporterMeetings'] = $exCount; 

 
            }
            $responseData['error'] = false; 
            


            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}

  //---Get company Meeting statistic
  public function getCompanyMeetingStatistic(Request $request, Response $response, $args)
{
 
        $this->request=$request;
        $this->response=$response;
        $result=array();

        $companyID = $args['companyID'];
        $companyType = $args['companyType'];
        $eventID = $args['eventID'];
        if($companyType==1)
            $field="importerId";
        else        
            $field="exporterId";


            $sql="select meetingPlannedDate,count(id) meetingsCount from meetings where $field=$companyID and eventId=$eventID group by meetingPlannedDate";
          

        

        $responseData = array();

      
      try{
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $data = $sth->fetchAll();
            $responseData['error'] = false; 
            $responseData['data'] = $data; 



            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
     

   
}
//-----------------------
  //---Reports
  public function getStatistic(Request $request, Response $response, $args)
  {
      $this->request=$request;
        $this->response=$response;
        $result=array();
        $inputs=array();
        $inputs = $request->getParsedBody();

        $reportId    = $inputs['reportId'];
        $companyID   = $inputs['companyId'];
        $companyType = $inputs['companyType'];
        $meetingDateFrom = $inputs['meetingDateFrom'];
        $meetingDateTo = $inputs['meetingDateTo'];

        $organizerId = $inputs['organizerId'];
        $eventID     = $inputs['eventID'];
        $reportType =  $inputs['reportType'];

        if($companyType==1)
            $field="importerId";
        else        
            $field="exporterId";
        $sql=array();
        //$reportId=1
      // if($reportId==1)
            // {
            $sql[0]="select meetings.*,importers.companyName as importerName,exporters.companyName as exporterName,events.eventTitle,importers.available as availableImporter, exporters.available as availableExporter,";
            $sql[0].="organizers.organizerName from meetings inner join companies as importers inner join companies as exporters inner join organizers";
            $sql[0].=" inner join events on importerId=importers.id and exporterId=exporters.id and eventId=events.id and organizerId=organizers.Id ";
            $sql[0].=" where eventId=$eventID";
            if($meetingDateFrom)
                $sql[0].=" and meetingPlannedDate >= '$meetingDateFrom' and meetingPlannedDate <= '$meetingDateTo'"; 
            if($organizerId)
                $sql[0].=" and organizerId=$organizerId";
            if($companyID)
                $sql[0].=" and (importerId=$companyID || exporterId=$companyID)";
            if($reportType == "pending_meetings")
                $sql[0].=" and meetingStatus = 0";
            else if($reportType == "current_meetings")
                $sql[0].=" and meetingStatus = 1";
            else if($reportType == "done_meetings")
                $sql[0].=" and meetingStatus = 2";

            $sql[0].=" order by meetingPlannedDate,meetingStatus asc";
            // }
      // if($reportId==2)
            // {
            $sql[1]="select sum(if(meetingStatus=0,1,0)) as counts0,sum(if(meetingStatus=1,1,0)) as counts1,sum(if(meetingStatus=2,1,0)) as counts2";
            $sql[1].=" ,sum(importerExpectedDeals) as countImporterExpectedDeals, sum(exporterExpectedDeals) as countExporterExpectedDeals";
            $sql[1].=" ,sum(importerExpectedDealsValue) as countImporterExpectedDealsValue, sum(exporterExpectedDealsValue) as countExporterExpectedDealsValue";
            $sql[1].=" from meetings where eventId=$eventID";
            if($meetingDateFrom)
                $sql[1].=" and meetingPlannedDate >= '$meetingDateFrom' and meetingPlannedDate <= '$meetingDateTo'"; 
            if($organizerId)
                $sql[1].=" and organizerId=$organizerId";
            if($companyID)
                $sql[1].=" and (importerId=$companyID || exporterId=$companyID)";

            $sql[1].=" group by eventId";
            // }
        $responseData = array();

      
      try{
            $sth = $this->db->prepare($sql[0]);
            $sth->execute();
            $data = $sth->fetchAll();
            $responseData['error'] = false; 
            $responseData['rowsCount'] = sizeof($data);
            $responseData['data'] = $data; 
            $sth = $this->db->prepare($sql[1]);
            $sth->execute();
            $data = $sth->fetchAll();
            $responseData['summary'] = $data; 


            }
      catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            }
      
       

      return $this->response->withJson($responseData);
}
    //=== Get Statistics Function ===
    public function getStatistics(Request $request, Response $response)
    {
        $this->request      =   $request;
        $this->response     =   $response;
        $result             =   array();
        $inputs             =   array();
        $inputs             =   $request->getParsedBody();

        $eventID    =   $inputs['eventID'];
        $reportType =   $inputs['reportType'];
        
        if($reportType == "organizers")
        {
            $sql     =  "select organizers.organizerName,sum(if(meetingStatus=0,1,0)) as pendingMeetings,sum(if(meetingStatus=1,1,0)) as currentMeetings,sum(if(meetingStatus=2,1,0)) as doneMeetings";
            $sql    .=  " ,sum(importerExpectedDeals) as countImporterExpectedDeals, sum(exporterExpectedDeals) as countExporterExpectedDeals,sum(importerExpectedDealsValue) as countImporterExpectedDealsValue, sum(exporterExpectedDealsValue) as countExporterExpectedDealsValue";
            $sql    .=  " ,sum(importerExpectedDealsValue) as countImporterExpectedDealsValue, sum(exporterExpectedDealsValue) as countExporterExpectedDealsValue";
            $sql    .=  " from meetings";
            $sql    .=  " INNER JOIN organizers on organizers.id = meetings.organizerId";
            if($eventID)
            {
                $sql    .=  " where meetings.eventId=$eventID";
            }
            $sql    .=  " GROUP BY meetings.organizerId";
        }
        else if($reportType == "companies")
        {
            $sql     =  "select companies.companyName, if(companies.companyType = 1, 'Buyer ', 'Seller') company_type";
            //$sql    .=  " ,if(companies.companyType = 1, count(meetings.exporterMeetingFeedback), count(meetings.importerMeetingFeedback)) countFeedback";
            $sql    .=  " ,if(companies.companyType = 1, avg(meetings.exporterMeetingFeedback), avg(meetings.importerMeetingFeedback)) AvgFeedback";
            $sql    .= " ,IF (companies.companyType = 1,(select count(*) from meetings where importerId = companies.id),(select count(*) from meetings where exporterId = companies.id)) AS count_meetings";
            $sql    .= " ,IF (companies.companyType = 1,(select sum(importerExpectedDeals) from meetings where importerId = companies.id),(select sum(exporterExpectedDeals) from meetings where exporterId = companies.id)) AS sum_expected_deals";
            $sql    .= " ,IF (companies.companyType = 1,(select sum(importerExpectedDealsValue) from meetings where importerId = companies.id),(select sum(exporterExpectedDealsValue) from meetings where exporterId = companies.id)) AS sum_expected_deal_values";
            $sql    .=  " from meetings";
            $sql    .=  " INNER JOIN companies on if(companies.companyType = 1, meetings.importerId = companies.id, meetings.exporterId = companies.id)";
            $sql    .=  " where meetings.meetingStatus = 2";
            if($eventID)
            {
                $sql    .=  " and meetings.eventId=$eventID";
            }
            $sql    .=  " GROUP BY companies.id ORDER BY AvgFeedback DESC";
        }
        else if($reportType == "countries")
        {
            $sql     =  "select countries.name, count(DISTINCT companies.id) AS totalCompanies, sum(exporterExpectedDealsValue) totalExporterExpectedDealsValue, sum(importerExpectedDealsValue) totalImporterExpectedDealsValue";
            $sql    .=  " from meetings";
            $sql    .=  " INNER JOIN companies on (companies.id = meetings.exporterId or companies.id = meetings.importerId)";
            $sql    .=  " INNER JOIN countries on countries.id = companies.countryId";
            $sql    .=  " where meetings.meetingStatus = 2";
            if($eventID)
            {
                $sql    .=  " and meetings.eventId=$eventID";
            }
            $sql    .=  " GROUP BY countries.id having totalExporterExpectedDealsValue > 0 or totalImporterExpectedDealsValue > 0";
            $sql    .=  " ORDER BY totalExporterExpectedDealsValue DESC, totalImporterExpectedDealsValue DESC";
        }
        
        try{
            $sth = $this->db->prepare($sql);
            $sth->execute();
            $data = $sth->fetchAll();
            $responseData['error']      =   false; 
            $responseData['rowsCount']  =   sizeof($data);
            $responseData['summary']    =   $data; 
            $responseData['sql']    =   $sql; 
        }
      catch (\PDOException $e) {
          $responseData                    =   array();
          $responseData['error']           =   true; 
          $responseData['errorCode']       =   $e->getMessage();
          $responseData['sql']       =   $sql;
      }
      return $this->response->withJson($responseData);
    }
    //=== End Function ===

*/

	 /*
    //---companyLogin
   public function companyLogin(Request $request, Response $response, $args)
   {
       $this->response=$response;
       $this->request=$request;
       $table = "companies";
       $userName = $args['userName'];
       $password = $args['password'];
       $args['table']=$table;
       $args['whereStatement']="loginEmail='$userName' and loginPassword='$password'";

  return crudController::get($request,$response,$args,1,$this->db);
   }
   */
//--------
//--------
}

?>


