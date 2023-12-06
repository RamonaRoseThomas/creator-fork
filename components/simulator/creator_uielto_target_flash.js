
/*
 *  Copyright 2018-2023 Felix Garcia Carballeira, Diego Camarmas Alonso, Alejandro Calderon Mateos
 *
 *  file is part of CREATOR.
 *
 *  CREATOR is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  CREATOR is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with CREATOR.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


  /* jshint esversion: 6 */

  var this_display = null;

  var uielto_flash = {
        props:      {
                      id:             { type: String, required: true },
                      target_board:   { type: String, required: true },
                      target_port:    { type: String, required: true },
                      flash_url:      { type: String, required: true }
                    },

        data:       function () {
                      return {
                        target_boards = [
                                          { text: 'ESP32-C2 (RISC-V)',  value: 'esp32c2' },
                                          { text: 'ESP32-C3 (RISC-V)',  value: 'esp32c3' },
                                          { text: 'ESP32-H2 (RISC-V)',  value: 'esp32h2' },
                                        //{ text: 'ESP32-S2 (MIPS-32)', value: 'esp32s2' },
                                        //{ text: 'ESP32-S3 (MIPS-32)', value: 'esp32s3' },
                                        ],

                        /*target_ports  = { Win: 'rfc2217://host.docker.internal:4000?ign_set_control', Mac: '/dev/cu.usbserial-210', Linux: '/dev/ttyUSB0' },

                        target_board  = "esp32c3",
                        target_port   = this.get_target_port(),
                        flash_url     = "http://localhost:8080",*/

                        flashing = false,
                        running  = false,

                        display = "",
                      }
                    },

        methods:    {
                      /*get_target_port()
                      {
                        return target_ports[this._props.os];
                      },*/

                      //Download driver
                      download_driver()
                      {
                        var link = document.createElement("a");
                        link.download = "driver.zip";
                        link.href = (window.location.href.split('?')[0]).split('#')[0] + "/gateway/" + this.target_board + ".zip";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        delete link;

                        //Google Analytics
                        creator_ga('simulator', 'simulator.download_driver', 'simulator.download_driver');
                      },

                      do_flash( )
                      {
                        this.save();

                        if(instructions.length == 0)
                        {
                          show_notification("Compile a program first", 'danger') ;
                          return;
                        }


                        this.flashing = true;

                        var farg =  {
                                      target_board: this.target_board,
                                      target_port:  this.target_port,
                                      assembly:     code_assembly,
                                    } ;

                        this_display = this;
                        gateway_remote_flash(this.flash_url + "/flash", farg).then( function(data)  { 
                                      				                                                        this_display.display += data; 
                                      				                                                        this_display.flashing = false; 
                                      				                                                        var monitor = document.getElementById('textarea_display'); 
                                      				                                                        monitor.scrollTop = monitor.scrollHeight;
                                                                                                      show_notification(data, 'danger') ;
                                      			                                                        } ) ;

                        //Google Analytics
                        creator_ga('simulator', 'simulator.flash', 'simulator.flash');
                      },

                      do_monitor( )
                      {
                        this.save();

                        this.running = true;

                        var farg =  {
                                      target_board: this.target_board,
                                      target_port:  this.target_port,
                                      assembly:     code_assembly,
                                    } ;

                        this_display = this;
                        gateway_remote_monitor(this.flash_url + "/monitor", farg).then( function(data)  { 
                                                                                                          this_display.display += data; 
                                                                                                          this_display.running = false; 
                                                                                                          var monitor = document.getElementById('textarea_display'); 
                                                                                                          monitor.scrollTop = monitor.scrollHeight;
                                                                                                          show_notification(data, 'danger') ;
                                                                                                        } ) ;

                        //Google Analytics
                        creator_ga('simulator', 'simulator.monitor', 'simulator.monitor');
                      },

                      do_stop_flash( )
                      {
                        this.save();
                        
                        this.flashing = false;

                        this_display = this;
                        gateway_remote_stop_flash(this.flash_url + "/stop").then( function(data)  { 
                                      				                                                      this_display.display += data; 
                                      				                                                      this_display.flashing = false; 
                                      				                                                      var monitor = document.getElementById('textarea_display'); 
                                      				                                                      monitor.scrollTop = monitor.scrollHeight;
                                                                                                    show_notification(data, 'danger') ;
                                      			                                                      } ) ;

                        //Google Analytics
                        creator_ga('simulator', 'simulator.stop_flash', 'simulator.stop_flash');
                      },

                      save( )
                      {
                        app._data.target_board = this._props.target_board;
                        app._data.target_port = this._props.target_port;
                        app._data.flash_url = this._props.flash_url;
                      },

                      clean( )
                      {
                        this.display = "";
                      },
                    },

      template:     ' <b-modal :id="id"' +
                    '          title="Target Board Flash"' +
                    '          hide-footer' +
                    '          @hidden="save">' +
                    ' ' +
                    '   <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '     <b-row cols="1" align-h="center">' +
                    '       <b-col class="pt-2">' +
                    '         <label for="range-6">(1) Select Target Board:</label>' +
                    '         <b-form-select v-model="target_board" ' +
                    '                        :options="target_boards" ' +
                    '                        size="sm"' +
                    '                        title="Target board">' +
                    '         </b-form-select>' +
                    '       </b-col>' +
                    '     </b-row>' +
                    '   </b-container>' +
                    '   <br>' +
                    ' ' +
                    '   <b-tabs content-class="mt-3">' +
                    '     <b-tab title="Prerequisites">' +
                    ' ' +
                    '       <b-tabs content-class="mt-3">' +
                    '         <b-tab title="Windows" active>' +
                    '           <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '             <b-row cols="1" align-h="center">' +
                    '               <b-col class="pt-2">' +
                    '                 <label for="range-6">(2) Install Docker Desktop (only the first time):</label>' +
                    '                 <b-card class="text-center">' +
                    '                   <b-row no-gutters>' +
                    '                     <b-col md="12">' +
                    '                       <b-card-text style="text-align: left;margin:2%;">' +
                    '                         <span>Follow the instructions from: <a href="https://docs.docker.com/desktop/install/windows-install/" target="_blank">https://docs.docker.com/desktop/install/windows-install/</a></span>' +
                    '                       </b-card-text>' +
                    '                     </b-col>' +
                    '                   </b-row>' +
                    '                 </b-card>' +
                    '               </b-col>' +
                    '             </b-row>' +
                    '           </b-container>' +
                    ' ' +
                    '           <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '             <b-row cols="1" align-h="center">' +
                    '               <b-col class="pt-2">' +
                    '                 <label for="range-6">(3) Download esptool (only the first time):</label>' +
                    '                 <b-card class="text-center">' +
                    '                   <b-row no-gutters>' +
                    '                     <b-col md="12">' +
                    '                       <b-card-text style="text-align: left;margin:2%;">' +
                    '                         <span>Download from: <a href="https://github.com/espressif/esptool/reles" target="_blank">https://github.com/espressif/esptool/releases</a></span>' +
                    '                       </b-card-text>' +
                    '                     </b-col>' +
                    '                   </b-row>' +
                    '                 </b-card>' +
                    '               </b-col>' +
                    '             </b-row>' +
                    '           </b-container>' +
                    ' ' +
                    '           <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '             <b-row cols="1" align-h="center">' +
                    '               <b-col class="pt-2">' +
                    '                 <label for="range-6">(4) Pull creator_gateway image in Docker Desktop:</label>' +
                    '                 <b-card class="text-center">' +
                    '                   <b-row no-gutters>' +
                    '                     <b-col md="12">' +
                    '                       <b-card-text style="text-align: left;margin:2%;">' +
                    '                         <ol style="margin:3%;">' +
                    '                           <li>Search for "creatorsim/creator_gateway" in the Docker Desktop browser</li>' +
                    '                           <li>Click the "Pull" button</li>' +
                    '                         </ol>' +
                    '                       </b-card-text>' +
                    '                     </b-col>' +
                    '                   </b-row>' +
                    '                 </b-card>' +
                    '               </b-col>' +
                    '             </b-row>' +
                    '           </b-container>' +
                    ' ' +
                    '           <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '             <b-row cols="1" align-h="center">' +
                    '               <b-col class="pt-2">' +
                    '                 <label for="range-6">(5) Run creator_gateway image:</label>' +
                    '                 <b-card class="text-center">' +
                    '                   <b-row no-gutters>' +
                    '                     <b-col md="12">' +
                    '                       <b-card-text style="text-align: left;margin:2%;">' +
                    '                         <ol style="margin:3%;">' +
                    '                           <li>Click the "Run" button</li>' +
                    '                           <li>Click the "Optional settings" button</li>' +
                    '                           <li>Set the Host port to 8080</li>' +
                    '                           <li>Click the "Run" button</li>' +
                    '                         </ol>' +
                    '                       </b-card-text>' +
                    '                     </b-col>' +
                    '                   </b-row>' +
                    '                 </b-card>' +
                    '               </b-col>' +
                    '             </b-row>' +
                    '           </b-container>' +
                    ' ' +
                    '           <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '             <b-row cols="1" align-h="center">' +
                    '               <b-col class="pt-2">' +
                    '                 <label for="range-6">(6) Run start_gateway script in the container bash:</label>' +
                    '                 <b-card class="text-center">' +
                    '                   <b-row no-gutters>' +
                    '                     <b-col md="12">' +
                    '                       <b-card-text style="text-align: left;margin:2%;">' +
                    '                         <ol style="margin:3%;">' +
                    '                           <li>Click the "Exec" button</li>' +
                    '                           <li>Execute <code>./start_gateway.sh</code>' +
                    '                         </ol>' +
                    '                       </b-card-text>' +
                    '                     </b-col>' +
                    '                   </b-row>' +
                    '                 </b-card>' +
                    '               </b-col>' +
                    '             </b-row>' +
                    '           </b-container>' +
                    ' ' +
                    '           <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '             <b-row cols="1" align-h="center">' +
                    '               <b-col class="pt-2">' +
                    '                 <label for="range-6">(7) Run esp_rfc2217_server in windows cmd:</label>' +
                    '                 <b-card class="text-center">' +
                    '                   <b-row no-gutters>' +
                    '                     <b-col md="12">' +
                    '                       <b-card-text style="text-align: left;margin:2%;">' +
                    '                         <ol style="margin:3%;">' +
                    '                           <li>Execute the windows cmd in the esptool path</li>' +
                    '                           <li>Execute <code>esp_rfc2217_server -v -p 4000 <target_port></code>' +
                    '                         </ol>' +
                    '                         <span>For more information: <a href="https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/tools/idf-docker-image.html#using-remote-serial-port" target="_blank">https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/tools/idf-docker-image.html#using-remote-serial-port</a></span>' +
                    '                       </b-card-text>' +
                    '                     </b-col>' +
                    '                   </b-row>' +
                    '                 </b-card>' +
                    '               </b-col>' +
                    '             </b-row>' +
                    '           </b-container>' +
                    '         </b-tab>' +
                    ' ' +
                    '         <b-tab title="Linux/MacOS">' +
                    '           <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '             <b-row cols="1" align-h="center">' +
                    '               <b-col class="pt-2">' +
                    '                 <label for="range-6">(2) Install Docker Engine (only the first time):</label>' +
                    '                 <b-card class="text-center">' +
                    '                   <b-row no-gutters>' +
                    '                     <b-col md="12">' +
                    '                       <b-card-text style="text-align: left;margin:2%;">' +
                    '                         <span>Follow the instructions from: <a href="https://docs.docker.com/engine/install/" target="_blank">https://docs.docker.com/engine/install/</a></span>' +
                    '                       </b-card-text>' +
                    '                     </b-col>' +
                    '                   </b-row>' +
                    '                 </b-card>' +
                    '               </b-col>' +
                    '             </b-row>' +
                    '           </b-container>' +
                    ' ' +
                    '           <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '             <b-row cols="1" align-h="center">' +
                    '               <b-col class="pt-2">' +
                    '                 <label for="range-6">(3) Pull creator_gateway image:</label>' +
                    '                 <b-card class="text-center">' +
                    '                   <b-row no-gutters>' +
                    '                     <b-col md="12">' +
                    '                       <b-card-text style="text-align: left;margin:2%;">' +
                    '                         <code>docker pull creatorsim/creator_gateway</code>' +
                    '                       </b-card-text>' +
                    '                     </b-col>' +
                    '                   </b-row>' +
                    '                 </b-card>' +
                    '               </b-col>' +
                    '             </b-row>' +
                    '           </b-container>' +
                    ' ' +
                    '           <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '             <b-row cols="1" align-h="center">' +
                    '               <b-col class="pt-2">' +
                    '                 <label for="range-6">(4) Run creator_gateway image:</label>' +
                    '                 <b-card class="text-center">' +
                    '                   <b-row no-gutters>' +
                    '                     <b-col md="12">' +
                    '                       <b-card-text style="text-align: left;margin:2%;">' +
                    '                         <code>docker run --init -it --device=<target_port> -p 8080:8080 --name creator_gateway creatorsim/creator_gateway /bin/bash</code>' +
                    '                       </b-card-text>' +
                    '                     </b-col>' +
                    '                   </b-row>' +
                    '                 </b-card>' +
                    '               </b-col>' +
                    '             </b-row>' +
                    '           </b-container>' +
                    ' ' +
                    '           <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '             <b-row cols="1" align-h="center">' +
                    '               <b-col class="pt-2">' +
                    '                 <label for="range-6">(5) Run start_gateway script in the container bash:</label>' +
                    '                 <b-card class="text-center">' +
                    '                   <b-row no-gutters>' +
                    '                     <b-col md="12">' +
                    '                       <b-card-text style="text-align: left;margin:2%;">' +
                    '                         <code>./start_gateway.sh</code>' +
                    '                       </b-card-text>' +
                    '                     </b-col>' +
                    '                   </b-row>' +
                    '                 </b-card>' +
                    '               </b-col>' +
                    '             </b-row>' +
                    '           </b-container>' +
                    '         </b-tab>' +
                    '       </b-tabs>' +
                    '     </b-tab>' +
                    ' ' +
                    '     <b-tab title="Run" active>' +
                    '       <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '         <b-row cols="1" align-h="center">' +
                    '           <b-col class="pt-2">' +
                    '             <label for="range-6">(2) Target Port: (please verify the port on your computer)</label>' +
                    '             <b-form-input type="text" ' +
                    '                           v-model="target_port" ' +
                    '                           placeholder="Enter target port" ' +
                    '                           size="sm" ' +
                    '                           title="Target port">' +
                    '             </b-form-input>' +
                    '           </b-col>' +
                    '         </b-row>' +
                    '       </b-container>' +
                    ' ' +
                    '       <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '         <b-row cols="1" align-h="center">' +
                    '           <b-col class="pt-2">' +
                    '             <label for="range-6">(3) Flash URL:</label>' +
                    '             <b-form-input type="text" ' +
                    '                           v-model="flash_url" ' +
                    '                           placeholder="Enter flash URL" ' +
                    '                           size="sm" ' +
                    '                           title="Flash URL">' +
                    '             </b-form-input>' +
                    '           </b-col>' +
                    '         </b-row>' +
                    '       </b-container>' +
                    ' ' +
                    '       <br>' +
                    ' ' +
                    '       <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '         <b-row cols="2" align-h="center">' +
                    '           <b-col class="pt-2">' +
                    '             <b-button class="btn btn-sm btn-block" variant="primary" @click="do_flash" :pressed="flashing" :disabled="flashing || running">' +
                    '               <span v-if="!flashing"><span class="fas fa-bolt-lightning"></span> Flash</span>' +
                    '               <span v-if="flashing"><span class="fas fa-bolt-lightning"></span>  Flashing...</span>' +
                    '               <b-spinner small v-if="flashing"></b-spinner>' +
                    '             </b-button>' +
                    '           </b-col>' +
                    '           <b-col class="pt-2">' +
                    '             <b-button class="btn btn-sm btn-block" variant="primary" @click="do_monitor" :pressed="running" :disabled="running || flashing">' +
                    '               <span v-if="!running"><span class="fas fa-play"></span> Monitor</span>' +
                    '               <span v-if="running"><span class="fas fa-play"></span>  Runing...</span>' +
                    '               <b-spinner small v-if="running"></b-spinner>' +
                    '             </b-button>' +
                    '           </b-col>' +
                    /*'           <b-col class="pt-2">' +
                    '             <b-button class="btn btn-sm btn-block" variant="outline-danger" @click="do_stop_flash" :disabled="!flashing">' +
                    '               <span><span class="fas fa-stop"></span> Stop</span>' +
                    '             </b-button>' +
                    '           </b-col>' +*/
                    '         </b-row>' +
                    '       </b-container>' +
                    ' ' +
                    '       <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '         <b-row cols="1" align-h="center">' +
                    '           <b-col class="pt-2">' +
                    '             <span>To stop the program execution press ctrl + ] in the terminal</span>' +
                    '           </b-col>' +
                    '         </b-row>' +
                    '       </b-container>' +
                    ' ' +
                    /*'       <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '         <b-row cols="1" align-h="center">' +
                    '           <b-col class="pt-2">' +
                    '             <label for="range-6">Monitor:</label>' +
                    '             <b-form-textarea  id="textarea_display" ' +
                    '                               size="sm"' +
                    '                               v-model="display" ' +
                    '                               rows="8" ' +
                    '                               disabled ' +
                    '                               no-resize ' +
                    '                               title="Display">' +
                    '             </b-form-textarea>' +
                    '           </b-col>' +
                    '         </b-row>' +
                    '       </b-container>' +
                    ' ' +
                    '       <b-container fluid align-h="center" class="mx-0 px-0">' +
                    '         <b-row cols="1" align-h="center">' +
                    '           <b-col class="pt-2">' +
                    '             <b-button class="btn btn-sm btn-block" variant="outline-secondary" @click="clean">' +
                    '               <span><span class="fas fa-broom"></span> Clean</span>' +
                    '             </b-button>' +
                    '           </b-col>' +
                    '         </b-row>' +
                    '       </b-container>' +*/
                    '     </b-tab>' +
                    '   </b-tabs>' +
                    ' </b-modal>'
  
  }

  Vue.component('flash', uielto_flash)


  //
  // Web service functions
  //

  async function gateway_remote_flash ( flash_url, flash_args )
  {
    var fetch_args =  {
                        method:   'POST',
                        headers:  {
                                    'Content-type': 'application/json',
                                    'Accept':       'application/json'
                                  },
                        body:     JSON.stringify(flash_args)
                      } ;

    try
    {
      var res  = await fetch(flash_url, fetch_args) ;
      var jres = await res.json();

      return jres.status
    }
    catch (err)
    {
      if (err.toString() == "TypeError: Failed to fetch") {
        return "Please, execute 'python3 gateway.py' and connect your board first\n";
      }

      return err.toString() + "\n";
    }
  }

  async function gateway_remote_monitor ( flash_url, flash_args )
  {
    var fetch_args =  {
                        method:   'POST',
                        headers:  {
                                    'Content-type': 'application/json',
                                    'Accept':       'application/json'
                                  },
                        body:     JSON.stringify(flash_args)
                      } ;

    try
    {
      var res  = await fetch(flash_url, fetch_args) ;
      var jres = await res.json();

      return jres.status
    }
    catch (err)
    {
      if (err.toString() == "TypeError: Failed to fetch") {
        return "Please, execute 'python3 gateway.py' and connect your board first\n";
      }

      return err.toString() + "\n";
    }
  }

  async function gateway_remote_stop_flash ( flash_url )
  {
    var fetch_args =  {
                        method:   'POST',
                        headers:  {
                                    'Content-type': 'application/json',
                                    'Accept':       'application/json'
                                  },
                        body:     JSON.stringify({})
                      } ;

    try
    {
      var res  = await fetch(flash_url, fetch_args) ;
      var jres = await res.json();

      return jres.status
    }
    catch (err)
    {
      if (err.toString() == "TypeError: Failed to fetch") {
        return "Please, execute 'python3 gateway.py' and connect your board first\n";
      }

      return err.toString() + "\n";
    }
  }

