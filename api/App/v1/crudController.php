<?php
namespace App\v1;
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;


class crudController
{
  
    public $db;
    protected $response;
    protected $request;
    protected $pathToUpload="uploadFolder";
    protected $imgSmallWidth=100;
    protected $imgMediumWidth=200;
    
    
  
    public function __construct(ContainerInterface $container)
    {
      
        $this->db = $container->get('db');
    }
    
    //---getAll
   public function get(Request $request, Response $response, $args,$internal=false,$Db = false)
   {
        $this->request=$request;
        $this->response=$response;
       $inputs=array();
        $inputs = $request->getParsedBody();

       if ($internal==1)
       {
         //  echo "Internal request";
           $this->db = $Db;
             if($args['whereStatement'])
                    $inputs['whereStatement']=$args['whereStatement'];
            
       }
       $table = $args['table'];
       $page = $args['page'];

       $joinTables=$inputs['joinTables'];
       $joinOn=$inputs['joinOn'];
       $requestFields=$inputs['requestFields'];
     
       $pageSize =$inputs['pageSize']>0 ? $inputs['pageSize']:10;
       //if( inputs['pageSize'])$pageSize=;

       $orderBy=$inputs['orderBy'];
       $orderCase=$inputs['orderCase'];
       $whereStatement=$inputs['whereStatement'];
       $groupBy = $inputs['groupBy'];
       
       $sql="select ";
       if($requestFields)
            $sql.=$requestFields;
        else
            $sql.=" * ";
        if($joinTables)
            {
            $sql.=" from $joinTables ";
                if($joinOn)
                    $sql.=" on $joinOn ";
            }
        else
            $sql.=" from  $table";

       if($whereStatement)
            $sql.=" where ".$whereStatement;
        if($groupBy)
            $sql.= " group by ".$groupBy;
       if($orderBy)
            $sql.=" order by ".$orderBy." ".$orderCase;
             if($page==0){
                   $allrowsSql=$sql;
                 $allSth=$this->db->prepare($allrowsSql);
                 $allSth->execute();
                 $allData = $allSth->fetchAll();
            }
          //   echo $sql;die;
        if($page>=0)
            $sql.=" LIMIT ".$pageSize." OFFSET ".$pageSize*$page;
       
       $sth = $this->db->prepare($sql);

       try{
           

           $sth->execute();
            $data = $sth->fetchAll();

            $responseData = array();
            $responseData['error'] = false; 
            $responseData['rowsCount'] = sizeof($data);
            if($page==0)
              $responseData['allrowsCount'] = sizeof($allData);
            $responseData['data'] = $data; 
            
            }
       catch (\PDOException $e) {
        
            $responseData = array();
            $responseData['error'] = true; 
            $responseData['errorCode'] =  $e->getMessage(); 
            $responseData['sql'] = $sql; 
            
            }
       return $this->response->withJson($responseData);
     

   }
//--------
 ///Add
 public function add(Request $request, Response $response, $args)
 {
     $this->response=$response;
     $this->request=$request;
     $inputs = $request->getParsedBody();
     $table = $args['table'];
     $unique = $inputs['unique'];
     if($unique)
        {
            unset($inputs['unique']);
            $uniqueKeys = explode (",", $unique);  
            $uniqueResult = $this->unique($table,$uniqueKeys,$inputs,0);
            if($uniqueResult['duplicateData'])
                return $this->response->withJson($uniqueResult);  

        }
     $sql=$this->prepareSql("insert",$table,$inputs);
     $sth = $this->db->prepare($sql);
     try
        {
        $sth->execute();
        $input['id'] = $this->db->lastInsertId();
        $responseData = array();
        $responseData['error'] = false; 
        $responseData['data'] = $input; 
        }
     catch (\PDOException $e) 
        {
        $responseData = array();
        $responseData['error'] = true; 
        $responseData['errorCode'] =  $e->getMessage(); 
        }
     return $this->response->withJson($responseData);


 }

 //----Update
 public function update(Request $request, Response $response, $args)
 {
     $this->response=$response;
     $this->request=$request;
     $inputs = $request->getParsedBody();
     $table = $args['table'];
     $unique = $inputs['unique'];
      $whereCols=$args['primary'];
     $rowId=$args['id'];
     if($unique)
        {
            unset($inputs['unique']);
            $uniqueKeys = explode (",", $unique);  
            $uniqueResult = $this->unique($table,$uniqueKeys,$inputs,$rowId);
            if($uniqueResult['duplicateData'])
                return $this->response->withJson($uniqueResult);  

        }

     $sql=$this->prepareSql("update",$table,$inputs);
     $sql.=" where ".$whereCols."=".$rowId;
   // echo $sql;
      $sth = $this->db->prepare($sql);
      try
        { 
        $sth->execute();
        $responseData = array();
        $responseData['error'] = false; 
        }
    catch (\PDOException $e) 
       {
       $responseData = array();
       $responseData['error'] = true; 
       $responseData['errorCode'] =  $e->getMessage(); 
       }       
     return $this->response->withJson($responseData);


 }
 //delete
public function delete(Request $request, Response $response, $args)
 {
     $this->response=$response;
     $this->request=$request;
     $table = $args['table'];
       $whereCols=$args['primary'];
     $id = $args['id'];
     $inputs=array();
     $inputs = $request->getParsedBody();
     $whereStatement=$inputs['whereStatement'];

 
     $sql=" delete from ".$table;
     if($whereStatement)
            $sql.=" where ".$whereStatement;
    else
        $sql.=" where ".  $whereCols." = ".$id;
  
        $sth = $this->db->prepare($sql);
     try
        { 
        $sth->execute();
        $responseData = array();
        $responseData['error'] = false; 
        }
    catch (\PDOException $e) 
       {
       $responseData = array();
       $responseData['error'] = true; 
       $responseData['errorCode'] =  $e->getMessage(); 
       }       
     return $this->response->withJson($responseData);
 }


public function prepareSql($sqlType,$tableName,$inputs)

{
    if($sqlType=="insert")
    {
    $sql="insert into ".$tableName." (";
    $sqlVales=") values(";
    $index=1;
    foreach($inputs as $field => $fieldValue) 
        {
        $sql.=$field;       
        $sqlVales.='"'.$fieldValue.'"';
        if($index<count($inputs))
            {
                $sql.=",";
                $sqlVales.=",";
            }
            $index++;
        }
    $sql.=$sqlVales.")";
    }
    else if($sqlType=="bulk")
    {
        $sql="insert into ".$tableName." (";
          $sqlValues=" ) values (";
  
      for($i=0;$i<count($inputs);$i++){
        $index=1;
        if($i>0)$sqlValues.=" , (";
         foreach($inputs[$i] as $field => $fieldValue) 
            {
           if($i==0) $sql.=$field;       
            $sqlValues.='"'.$fieldValue.'"';
            if($index<count($inputs[$i]))
                {
                   if($i==0){ $sql.=",";}
                    $sqlValues.=",";
                }
                $index++;
            } 
            $sqlValues.=")";
       
            
        }
            $sql.=$sqlValues.";"; 

    }
    else
    {
        $sql="update ".$tableName." set ";
       
        $index=1;
        foreach($inputs as $field => $fieldValue) 
            {
            $sql.=$field;       
            $sql.='="'.$fieldValue.'"';
            if($index<count($inputs))
                    $sql.=",";
            $index++;
            }
    }
    return $sql;

}

//-------Unique
public function unique($table,$fields,$values,$escapeId)
{
    $duplicateData=array();
    foreach($fields as $field ) 
    {
        $sql="select ".$field." from ".$table." where id !=".$escapeId." and ";
        $sql.=$field."='".$values[$field]."'";
    
    $sth = $this->db->prepare($sql);
    try{
         $sth->execute();
         $data = $sth->fetchAll();
         if($data)
            {
            array_push($duplicateData,$field);    
            }    
         }
    catch (\PDOException $e) {
         $responseData = array();
         $responseData['error'] = true; 
         $responseData['errorCode'] =  $e->getMessage(); 
         }
    }
         if(!$responseData['errorCode'])
         {
            $responseData = array();
            $responseData['error'] = false; 
            $responseData['duplicateData'] = $duplicateData; 

         }
     return $responseData;   
    
}
//---- Bulk Insert
public function bulkAdd(Request $request, Response  $response, $args)
{
    $this->response=$response;
     $this->request=$request;
     $inputs = $request->getParsedBody();
     $table = $args['table'];
     if(isset( $inputs['unique']) &&  $inputs['unique']!='')
     $unique =  $inputs['unique']; 
     
     if(isset( $inputs['primaryField']) &&  $inputs['primaryField']!='')
     $primaryField= $inputs['primaryField'];
     if(isset($unique))
        {
            unset($inputs['unique']);
            $uniqueKeys = explode (",", $unique);  
            $uniqueResult = $this->unique($table,$uniqueKeys,$inputs,0,$primaryField);
            if($uniqueResult['duplicateData'])
                return $this->response->withJson($uniqueResult);  

        }
     $sql=$this->prepareSql("bulk",$table,$inputs);
     $sth = $this->db->prepare($sql);
     try
        {
        $sth->execute();
        $input['id'] = $this->db->lastInsertId();
        $responseData = array();
        $responseData['error'] = false; 
        $responseData['data'] = $input; 
        }
     catch (\PDOException $e) 
        {
        $responseData = array();
        $responseData['error'] = true; 
        $responseData['errorCode'] =  $e->getMessage(); 
        }
     return $this->response->withJson($responseData);


}

public function renameFolder(Request $request, Response  $response) 
{
    $this->request=$request;
    $this->response=$response;
    $inputs = $request->getParsedBody();
    $basePath= '../uploadFolder/';
    rename($basePath.'original/'.$inputs['oldFolder'], $basePath.'original/'.$inputs['newFolder']);
    rename($basePath.'medium/'.$inputs['oldFolder'], $basePath.'medium/'.$inputs['newFolder']);
    rename($basePath.'small/'.$inputs['oldFolder'], $basePath.'small/'.$inputs['newFolder']);


    $responseData = array();
    $responseData['error'] = false; 
    return $this->response->withJson($responseData);  
}

public function upload(Request $request, Response  $response) 
{
    $this->request=$request;
    $this->response=$response;
    $inputs = $request->getParsedBody();
    
    $pathToUpload=$inputs['uploadFolder']? $inputs['uploadFolder']:$this->pathToUpload;

    $thumbSmallWidth=$inputs['imgSmallWidth']? $inputs['imgSmallWidth']:$this->imgSmallWidth;

    $thumbMediumWidth=$inputs['imgMediumWidth']? $inputs['imgMediumWidth']:$this->imgMediumWidth;
    $requestSmallThumb=$inputs['requestSmallThumb'] ;
    $requestMediumThumb=$inputs['requestMediumThumb'] ;
    $requestNewFolder=$inputs['requestNewFolder'] ;


    
    $uploadedFiles = $request->getUploadedFiles();
    if (empty($uploadedFiles['attachment'])) {
            echo "no files";
        }
        
    $file = $uploadedFiles['attachment'];
    $extension = strtolower(pathinfo($file->getClientFilename(), PATHINFO_EXTENSION));
    $basename = time(); 
    $filename = sprintf('%s.%0.8s', $basename, $extension);
    $folderName='';
    if($requestNewFolder)
    {
        $folderName = $inputs['folder']?$inputs['folder']:time(); 
        $folderPath= '../uploadFolder/original/'.$folderName;
        if (!file_exists($folderPath)) {mkdir($folderPath, 0777, true);					   chmod($folderPath,0777);
    }
        $folderPath= '../uploadFolder/small/'.$folderName;
        if (!file_exists($folderPath)) {mkdir($folderPath, 0777, true); chmod($folderPath,0777);}
        $folderPath= '../uploadFolder/medium/'.$folderName;
        if (!file_exists($folderPath)) {mkdir($folderPath, 0777, true); chmod($folderPath,0777);}
    }

  $src=($folderPath)? "../$pathToUpload/original/$folderName/$filename" : "../$pathToUpload/original/$filename";
    $file->moveTo($src);
    if($requestSmallThumb )
        {
        $thumbSmallDest="../$pathToUpload/small/$uploadFileName";
        $this->createThumb($src,$thumbSmallDest,$thumbSmallWidth,false);
        }
    if($requestMediumThumb )
        {
        $thumbMediumDest="../$pathToUpload/medium/$uploadFileName";
        $this->createThumb($src,$thumbMediumDest,$thumbMediumWidth,false);
        }
     

        $responseData = array();
        $responseData['error'] = false; 
        $data=array();
        $data['fileName']= ($folderPath)? "$folderName/$filename" : $filename;
        $data['filePath']="../uploadFolder/";
       
        $responseData['data'] = $data; 
        return $this->response->withJson($responseData);  
    
}

public function createThumb($src,$dest,$desired_width , $desired_height)
{
    if (!$desired_height&&!$desired_width) return false;
    $fparts = pathinfo($src);
    $ext = strtolower($fparts['extension']);
    if (!in_array($ext,array('gif','jpg','png','jpeg'))) return false;

    if ($ext == 'gif')
        $resource = imagecreatefromgif($src);
    else if ($ext == 'png')
        $resource = imagecreatefrompng($src);
    else if ($ext == 'jpg' || $ext == 'jpeg')
        $resource = imagecreatefromjpeg($src);
    
    $width  = imagesx($resource);
    $height = imagesy($resource);
    // find the "desired height" or "desired width" of this thumbnail, relative to each other, if one of them is not given  
    if(!$desired_height) $desired_height = floor($height*($desired_width/$width));
    if(!$desired_width)  $desired_width  = floor($width*($desired_height/$height));
  
    // create a new, "virtual" image 
    $virtual_image = imagecreatetruecolor($desired_width,$desired_height);
  
    // copy source image at a resized size 
    imagecopyresized($virtual_image,$resource,0,0,0,0,$desired_width,$desired_height,$width,$height);
    
    // create the physical thumbnail image to its destination 
    // Use correct function based on the desired image type from $dest thumbnail source 
    $fparts = pathinfo($dest);
    $ext = strtolower($fparts['extension']);
    // if dest is not an image type, default to jpg 
    if (!in_array($ext,array('gif','jpg','png','jpeg'))) $ext = 'jpg';
    $dest = $fparts['dirname'].'/'.$fparts['filename'].'.'.$ext;
    
    if ($ext == 'gif')
        imagegif($virtual_image,$dest);
    else if ($ext == 'png')
        imagepng($virtual_image,$dest,1);
    else if ($ext == 'jpg' || $ext == 'jpeg')
        imagejpeg($virtual_image,$dest,100);
    
  
}

public function excelupload(Request $request,Response $response)
{
    $this->request=$request;
    $this->response=$response;
    $inputs = $request->getParsedBody();
    
    $pathToUpload=$inputs['uploadFolder']? $inputs['uploadFolder']:$this->pathToUpload;

    

    
    $uploadedFiles = $request->getUploadedFiles();
    //echo $uploadedFiles['attachment'];print_r($uploadedFiles['attachment']); die();
    if (empty($uploadedFiles['attachment'])) {
            echo "no files";
        }
        
    $file = $uploadedFiles['attachment'];
    $extension = pathinfo($file->getClientFilename(), PATHINFO_EXTENSION);
    $basename = time(); 
    $filename = sprintf('%s.%0.8s', $basename, $extension);
    $folderName='';
   
        

  $src=($folderPath)? "../$pathToUpload/excel/$filename" : "../$pathToUpload/excel/$filename";
     
    $file->moveTo($src);
    
  
     

        $responseData = array();
        $responseData['error'] = false; 
        $data=array();
        $data['fileName']= ($folderPath)? "$folderName/$filename" : $filename;
        $data['filePath']="../uploadFolder/";
       
        $responseData['data'] = $data; 
        return $this->response->withJson($responseData);  
    
    
}


function moveUploadedFile($directory, UploadedFile $uploadedFile){
 $extension = pathinfo($uploadedFile->getClientFilename(), 
 PATHINFO_EXTENSION);
 $basename = bin2hex(random_bytes(8));
 $filename = sprintf('%s.%0.8s', $basename, $extension);
 $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);

return $filename;
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
                      $mail->Username = 'xxxx@gmail.com';                 
                      $mail->Password = 'xxxxxxxxx';                          
                      $mail->SMTPSecure = 'tls';                            
                      $mail->Port = 587;
                      
                      $mail->setFrom('xxxxxxxx@gmail.com', 'xxxxxxx');
                      $mail->addAddress('xxxxxxxxx@gmail.com');
  
                      $mail->isHTML(true); //send email in html formart
                      $mail->Subject = 'Admin panel  ,Contact us message';
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
  //------
  }
//------
}

?>


