/*
 *  Copyright 2018-2022 Felix Garcia Carballeira, Diego Camarmas Alonso, Alejandro Calderon Mateos
 *
 *  This file is part of CREATOR.
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

  var uielto_register_file = {

  props:      {
                data_mode:               { type: String, required: true },
                register_type:           { type: String, required: true }
              },

  data:       function () {
                return {
                  //Register value representation
                  reg_representation: "hex",
                  reg_representation_options: [
                    { text: 'Signed',   value: 'signed' },
                    { text: 'Unsig.',   value: 'unsigned' },
                    { text: 'IEEE 754', value: 'decimal'},
                    { text: 'Hex.',     value: 'hex' }
                  ],

                  //Register name representation
                  reg_name_representation: "all",
                  reg_name_representation_options: [
                    { text: 'Name',  value: 'logical' },
                    { text: 'Alias', value: 'alias' },
                    { text: 'All',   value: 'all'}
                  ]
                }
              },

  methods:    {
              
              },

  template:   ' <div class="col-lg-12 col-sm-12 px-0" id="register_file" v-if="data_mode == \'registers\'">' +
              '   <b-container fluid align-h="between" class="mx-0 px-0">' +
              '     <b-row cols-xl="2" cols-lg="1" cols-md="2" cols-sm="1" cols-xs="1" cols="1" >' +
              '       <b-col align-h="start" class="px-1">' +
              '         <b-form-group label="Register value representation:" v-slot="{ ariaDescribedby }">' +
              '           <b-form-radio-group' +
              '             id="btn-radios-1"' +
              '             class="w-100"' +
              '             v-model="reg_representation"' +
              '             :options="reg_representation_options"' +
              '             button-variant="outline-secondary"' +
              '             size="sm"' +
              '             :aria-describedby="ariaDescribedby"' +
              '             name="radios-btn-default"' +
              '             buttons' +
              '           ></b-form-radio-group>' +
              '         </b-form-group>' +
              '       </b-col>' +
              ' ' +
              '       <b-col align-h="end" class="px-1">' +
              '         <b-form-group label="Register name representation:" v-slot="{ ariaDescribedby }">' +
              '           <b-form-radio-group' +
              '             id="btn-radios-2"' +
              '             class="w-100"' +
              '             v-model="reg_name_representation"' +
              '             :options="reg_name_representation_options"' +
              '             button-variant="outline-secondary"' +
              '             size="sm"' +
              '             :aria-describedby="ariaDescribedby"' +
              '             name="radios-btn-default"' +
              '             buttons' +
              '           ></b-form-radio-group>' +
              '         </b-form-group>' +
              '       </b-col>' +
              '     </b-row>' +
              '   </b-container>' +
              '   ' +
              ' ' +
              '   <b-container fluid align-h="center">' +
              '     <b-row align-h="center" cols="1">' +
              '       <b-cols v-for="item in architecture_hash">' +
              '         <b-container fluid align-h="center" class="px-0 mx-0 mb-2" v-if="(register_type == architecture.components[item.index].type) || (register_type == \'integer\' && architecture.components[item.index].type == \'control\')">' +
              '           <b-row align-h="start" cols-xl="4" cols-lg="4" cols-md="4" cols-sm="3" cols-xs="3" cols="3">' +
              '             <b-col class="p-1 mx-0" v-for="(item2, index) in architecture.components[item.index].elements">' +
              ' ' +
              '               <register :component="item"' +
              '                         :register="item2"' +
              '                         :name_representation="reg_name_representation"' +
              '                         :value_representation="reg_representation">' +
              '               </register>' +
              ' ' +
              '            </b-col>' +
              '           </b-row>' +
              '         </b-container>' +
              '       </b-cols>' +
              '     </b-row>' +
              '   </b-container>' +
              ' </div>'

  }

  Vue.component('register-file', uielto_register_file) ;