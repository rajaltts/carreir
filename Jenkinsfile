@Library('ecat-library@develop') _
Apiname='reactjsui'
branchname='develop' 
pipeline {
  agent { label "${DBNODE}" } 
  options { 
	//skipDefaultCheckout true
	  disableConcurrentBuilds()
	  timestamps ()
	  buildDiscarder(logRotator(numToKeepStr: '20'))}
    parameters {
	string(name: 'BuildNo', defaultValue: getparams("defaultbuild"), description: getparams("buildnumdesc"))
	string(name: 'MasterBuildNo', defaultValue: getparams("defaultmasterbuild"), description: getparams("masterbuildnumdesc"))
    }
  stages {
	/*  stage('clean workspace') {
      steps {
        deleteDir()
        checkout scm
      }
    }*/
  stage("Set Build Name and config values") {
     steps {
        script {
		currentBuild.displayName = "${BuildNo}"
		configs=getjenkinvar.getJsonString(branchname)	
		Target=getparams("target")
		azureconfig=configs."${Target.toLowerCase()}".azure
                getappval=getjsonvalue(configs."${Target.toLowerCase()}","${Apiname.toLowerCase()}")
                emailtoval=getjenkinvar.getemailval(getappval.emailto)
		}
	 }
	}
	stage("parallel1") 
	{
	parallel
	{
		stage("Delete previous folders") {
     	steps {
        	script {

                //Delete previous folders
				//fileandfolderops.deletedirectory("${getappval.gitreponame}")
                fileandfolderops.deletefile("${getappval.artifactzipname}.zip")
                fileandfolderops.deletedirectory("${getappval.buildfolder}")
				minify=getappval.minify
                }
           }
    	}
	stage("Create git tag") {
		when {
                // Tag only if required
                expression { getappval.gittag == 'true' }
            }
		steps{
			script{
				gitops.tag(BuildNo)
				gitops.push(BuildNo)		
			}
		}
		}
	 stage("npm install"){
     steps {	     
		script{	
			if(getappval.gittag == 'false')
			{
				gitcheckout.nosparse("refs/tags/${BuildNo}", evaluate("${getappval.gitrepo}"), getappval.gitreponame)
			}
			getjenkinvar.copyconfigfiles("${getappval.envconfig}")
			dir(getappval.gitreponame)
			{
				getjenkinvar.replacecharinfile(".\\package.json")
				npm.cache()
				npm.install()			
			}
			}//script	
		}//steps
	}//stage	
	}
	}
	stage("npm build"){
	    when {
                // Build without Sonar
                expression { getappval.sonarbuild == 'false' }
            }
	steps {	     
		script{	
			dir(getappval.gitreponame)
			{
				if(minify=="false"){
					npm.scriptBuild()
				}
				else{
					npm.scriptBuildandMinify()
				}				
			}
			}//script	
		}//steps
	}//stage
	stage("Create Zip") {
		steps{
		script {	
			// Copy multiple configuration files
			fileandfolderops.copyfile("${getappval.rootconfig}","${getappval.buildconfig}")
			echo "Zipping the artifacts"
			//Create zip folder
			artifacts.createzipwithfolders("${getappval.artifactzipname}","${getappval.buildfolder}\\*",'yes')
			echo "Zip file created"
			}
		}		
	}
	stage("parallel 2") {
	parallel { 
	stage('Upload Artifacts to JFROG') {
	  // Upload only for production environment
	  when {expression { Target.toLowerCase() == 'prod' } }
	    steps {
	     script{    
		 	artifacts.upload("${WORKSPACE}\\${getappval.artifactzipname}.zip",artifacts.getpath(Target.toLowerCase(),MasterBuildNo,BuildNo,getappval.artifactname,"u"))
		 }
	 }//steps
  }//stage
	stage('Deploy to Web Apps') {
	steps {	
    		script {		    
		echo "Azure Deployment"		  
		artifacts.azurereactappdeploy(branchname,azureconfig.azureun,azureconfig.azurepwd,getappval.resourcegroup,getappval.appname,"${workspace}\\${getappval.artifactzipname}.zip",azureconfig.tenantid,azureconfig.subscriptionid,getappval.apphostdeploy,getappval.deploytoprodslot)
   		 }
  	  }//steps
	}//stage
	}//parallel
	}//stage
	stage('Trigger other pipelines') {
		when {expression { getappval."pipelinestorun" } }
    	   steps {	
    	      script{
		      pipelineList= getappval."pipelinestorun"
		      pipeline = pipelineList.split(';')
		      pipeline.each{
			      echo it
			      jobName=configs."${Target}"."${it}"."appreleasejob"
			      echo jobName
			      build job: jobName, parameters: [ string(name: 'BuildNo', value: "latest")], wait: false
		      }
		 }//script
  	  }//steps
	}//stage
  }//stages
  post {
 	success {
	emailext attachLog: true, body: '$DEFAULT_CONTENT', recipientProviders: [developers(), requestor()], replyTo: '$DEFAULT_REPLYTO', subject: '$DEFAULT_SUBJECT', to: "${emailtoval}"
    }
   failure {
        emailext attachLog: true, body: '$DEFAULT_CONTENT', recipientProviders: [developers(), requestor()], replyTo: '$DEFAULT_REPLYTO', subject: '$DEFAULT_SUBJECT', to: "${emailtoval}"
   }
  }//post
}//pipline
