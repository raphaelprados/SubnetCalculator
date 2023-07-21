
// import {ceil, log2} from Math 

const app = Vue.createApp({
    data() {
        return {
            class: "C",
            network_ip: "192.168.2.0",
            dec_ntwork_mask: "255.255.255.0",
            cidr_ntwork_mask: "255.255.255.0/24",
            networks: [],
            subnet_bits: [],
            mask_bits: [],
            max_subnets: [],
            hosts_per_subnet: [],
            host_add_range: {start: "", end: ""},
            subnet_id: "",
            bcast_add: "",
            trigger: "",
            octs: 0
        }
    },
    methods: {
        setClass(c) {
            this.class = c
            octs = this.class == 'C' ? 3 : this.class == 'B' ? 2 : 1
        },
        getNetworkIPOcts() {
            decimal_house = 100
            octs_c = 0
            octs = []
            for (i = 0; i < this.network_ip.length(); i++)
                if(this.network_ip[c] != '.') {
                    octs[0] += parseInt(this.network_ip[c]) * decimal_house
                    decimal_house /= 10
                }
                else {
                    decimal_house = 0
                    octs_c++
                }
            return octs
        },  
        host_add_getter(i) {
            add = ""
            temp = (i >>> 0).toString(2)
            add += temp
            for(j = 0; j < add.length() - (4 - this.octs)*8 - this.subnet_bits; j++)
                add.unshift("0") 
            return add
        },
        setNetworks() {
            total_hosts = 2**((4 - this.octs)*8 - this.subnet_bits)
            subnet_ntwrk_ids = []
            this.networks = []
            base = ""
            n = 0
            // Divide a string em inteiros com cada octeto e elimina os 0's
            octetos = this.network_ip.split('.')
            octetos.forEach(element => parseInt(element))
            octetos.filter(a => a !== 0)
            for(i = 0; i < 2**this.subnet_bits; i++) 
                // Adiciona os primeiros octetos, definidos no ip da rede total
                for(i = 0; i < octetos.length(); i++)
                    base += toString(octetos[i]) + "."
                network_info = {
                    subnet_id: "", 
                    first_host: "", 
                    last_host: "", 
                    subnet_bcast: "" 
                }
                for(i = 0; i < total_hosts; i++) {
                    switch(i) {
                        case 0:
                            network_info.subnet_id += this.host_add_getter(i)
                            break
                        case 1:
                            network_info.first_host += this.host_add_getter(i)
                            break
                        case total_hosts - 2:
                            network_info.last_host += this.host_add_getter(i)
                            break
                        case total_hosts - 1:
                            network_info.subnet_bcast += this.host_add_getter(i)
                            break
                    }
                }
                this.networks.push(network_info)
        },
        calcSubnetBits() {
            network_octs = this.getNetworkIPOcts()
            network_ip_bin = ""
            subnet_mask_bin = ""
            this.dec_ntwork_mask = ""
            this.cidr_ntwork_mask = ""
            temp = this.subnet_bits
            for(i = 0; i < octs; i++)
                subnet_mask_bin += "255."
            while(temp != 0) {
                if(temp % 8 != 0) {
                    subnet_mask_bin += "255."
                    temp -= 8
                } else {
                    mask_value = 0
                    for(i = 7; i > 7 - temp; i--)
                        mask_value += 2**i
                    subnet_mask_bin += toString(mask_value)
                }
            }
        },
        nBinDigits(value) {
            temp = value
            c = 0
            while(temp != 0) {
                temp /= 2
                temp = parseInt(temp)
                c++
            }
            return c            
        },
        calcSubnet() {
            // Define o numero de iteracoes a partir da classe
            switch(this.trigger) {
                case 'subnet_bits':       
                    this.calcSubnetBits()
                    break
                case 'max_subnets':
                    this.subnet_bits = nBinDigits(this.max_subnets)
                    this.calcSubnetBits()
                    break
                case 'hosts_per_subnet':
                    this.subnet_bits = (4 - this.octs)*8 - nBinDigits(this.hosts_per_subnet)
                    this.calcSubnetBits()
                    break
                case 'mask_bits':
                    this.subnet_bits = this.mask_bits - (4 - this.octs)*8
                    break
            }
        }
    },
    created() {
        

    }
})

app.mount('#app')