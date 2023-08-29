#! /bin/sh

my_var="contract"
# Open source folder
cd src
echo ------  $my_var

ls

echo ------
# Create module folders
mkdir $my_var

cd $my_var

mkdir services
mkdir controllers
mkdir interfaces

touch $my_var.module.ts

cd services 
touch $my_var.service.ts

cd ../controllers 
touch $my_var.controller.ts

cd ../interfaces
touch $my_var.interface.ts