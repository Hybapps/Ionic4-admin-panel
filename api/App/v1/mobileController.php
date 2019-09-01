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
 /// here you can add your special API endpoints code

  //---user Login
  public function userLogin(Request $request, Response $response, $args)
      {
 /// add you code for user Login ---
 
   
      }

} // clasee end
?>


