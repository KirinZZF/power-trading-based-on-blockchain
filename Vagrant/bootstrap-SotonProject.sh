echo "Install the Devlopment Environment"
#install golang
wget -P /vagrant https://golang.org/dl/go1.16.5.linux-amd64.tar.gz 
mkdir /vagrant/eth
mkdir /vagrant/GoInstall
mkdir /vagrant/work/go/{src,pkg,bin}
tar -zxvf /vagrant/go1.16.5.linux-amd64.tar.gz -C /vagrant/GoInstall

#modify the environment 
sed -i.bak '$a export GOROOT=/vagrant/GoInstall/go\nexport PATH=$PATH:$GOROOT/bin\n' /etc/profile
export GOROOT=/vagrant/GoInstall/go
export PATH=$PATH:$GOROOT/bin
export GOPATH=/vagrant/work/go
source /etc/profile
go version

#install the nmp and nodejs
sudo apt-get update
sudo apt-get install npm -y
npm -v

sudo apt-get install nodejs -y
node -v

#install Ethereum
cd /vagrant/eth
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install -y ethereum
geth --help
