var Reporting = Reporting || (Reporting = {});
(function (Reporting) {
    let Images;
    (function (Images) {
        class Icons {
            constructor() {
                this._user = {
                    data: `
                    <svg class="icon-user" viewBox="0 0 80 80">
                        <style>
                            .icon-user path ,
                            .icon-user polyline {
                                fill: none;
                                stroke: var(--icon-line-color, #555555);
                                stroke-width: 2px;
                                stroke-linecap: round;
                                stroke-linejoin: round;
                                stroke-miterlimit: 10;
                            }
                        </style>
                        <g>
                            <path d="M40.001,42.599c-5.038,0-9-4.095-9-9.134v-4.383l3.913-2.777l1.541,4.969L49,29.082v4.383C49,38.503,45.038,42.599,40.001,42.599z"/>
                            <path d="M50.47,28.946c0-5.942-4.743-10.772-10.681-10.772c-5.942,0-10.684,4.83-10.684,10.772"/>
                            <path d="M18.529,61.397c0-4.179,0-17.496,12.178-17.496l0,0c0,0,2.671,3.774,9.134,3.774s9.454-3.774,9.454-3.774"/>
                            <path d="M61.471,61.397c0-4.179,0-17.496-12.178-17.496"/>
                            <polyline points="31,61.827 31,56.827 48,56.827 48,61.827 "/>
                        </g>
                    </svg>`
                }
                this._message = {
                    data: `
                    <svg class="icon-message" viewBox="0 0 80 80">
                        <style>
                            .icon-message path,
                            .icon-message polyline,
                            .icon-message polygon {
                                fill: none;
                                stroke: var(--icon-line-color, #555555);
                                stroke-width: 2px;
                                stroke-linecap: round;
                                stroke-linejoin: round;
                                stroke-miterlimit: 10;
                            }
                            .icon-message line {
                                fill: none;
                                stroke: var(--icon-line-color, #555555);
                                stroke-linecap: round;
                                stroke-linejoin: round;
                            }
                            .icon-message .exclamation-mark {			
                                fill: var(--icon-line-color, #555555);
                                stroke: unset;
                                stroke-width: unset;
                                stroke-linecap: unset;
                                stroke-linejoin: unset;
                                stroke-miterlimit: unset;
                            }
                        </style>
                        <g>
                            <path d="M44.532,59.876"/>
                            <polyline points="35.473,62.167 21.568,62.167 21.568,16.5 46.31,16.5 55.756,25.982 55.756,44.947"/>
                            <polyline points="46.188,16.5 46.188,25.94 55.756,25.94"/>
                            <g>
                                <line x1="26.053" y1="29.546" x2="29.099" y2="32.593"/>
                                <line x1="29.024" y1="29.546" x2="25.979" y2="32.593"/>
                            </g>
                            <g>
                                <line x1="26.053" y1="38.056" x2="29.099" y2="41.102"/>
                                <line x1="29.024" y1="38.056" x2="25.979" y2="41.102"/>
                            </g>
                                <line x1="31.773" y1="31.042" x2="48.484" y2="31.042"/>
                                <line x1="31.773" y1="39.462" x2="48.484" y2="39.462"/>
                            <g>
                                <line x1="26.053" y1="46.46" x2="29.099" y2="49.506"/>
                                <line x1="29.024" y1="46.46" x2="25.979" y2="49.506"/>
                            </g>
                            <line x1="31.773" y1="47.881" x2="44.147" y2="47.881"/>
                            <g>
                                <polygon points="64.432,66.889 37.201,66.889 50.865,43.743"/>
                                <g>
                                    <path class="exclamation-mark" d="M50.817,63.416c-0.747,0-1.323-0.606-1.323-1.305c0-0.748,0.576-1.324,1.323-1.324
                                        c0.731,0,1.307,0.592,1.307,1.324C52.124,62.81,51.533,63.416,50.817,63.416z M51.579,58.811
                                        c-0.031,0.296-0.093,0.296-0.327,0.296h-0.887c-0.233,0-0.296,0-0.327-0.296l-0.343-6.076c-0.015-0.265-0.015-0.22-0.015-0.312
                                        c0-0.203,0.155-0.205,0.28-0.205h1.665c0.125,0,0.311,0.005,0.311,0.208c0,0.093,0,0.041-0.015,0.306L51.579,58.811z"/>
                                </g>
                            </g>
                        </g>
                    </svg>
                `
                }
                this._recipe = {
                    data: `
                    <svg class="icon-recipe" viewBox="0 0 80 80">
                        <style>
                            .icon-recipe path,
                            .icon-recipe polyline {
                                fill: none;
                                stroke: var(--icon-line-color, #555555);
                                stroke-width: 2px;
                                stroke-linecap: round;
                                stroke-linejoin: round;
                                stroke-miterlimit: 10;
                            }
                            .icon-recipe line{
                                fill: none;
                                stroke: var(--icon-line-color, #555555);
                                stroke-linecap: round;
                                stroke-linejoin: round;
                            }
                        </style>
                        <g>
                            <path d="M45.532,59.186"/>		
                            <polyline points="57,61.093 23,61.093 23,18 47.31,18 57,27.199 57,61.093"/>		
                            <polyline points="47,18 47,27 57,27"/>
                            <g>			
                                <line x1="28.303" y1="30.763" x2="31.349" y2="33.81"/>			
                                <line x1="31.274" y1="30.763" x2="28.229" y2="33.81"/>
                            </g>
                            <g>			
                                <line x1="28.303" y1="39.272" x2="31.349" y2="42.318"/>			
                                <line x1="31.274" y1="39.272" x2="28.229" y2="42.318"/>
                            </g>		
                            <line x1="34.25" y1="32.5" x2="50.25" y2="32.5"/>		
                            <line x1="34.25" y1="40.5" x2="50.25" y2="40.5"/>
                            <g>
                                <line x1="28.303" y1="47.677" x2="31.349" y2="50.723"/>
                                <line x1="31.274" y1="47.677" x2="28.229" y2="50.723"/>
                            </g>
                            <line x1="34.25" y1="49.5" x2="50.25" y2="49.5"/>
                        </g>
                    </svg>
                `
                }
                this._auditTrailInteraction = {
                    data: `
                    <svg class="icon-auditTrail" viewBox="0 0 80 80">
                        <style>
                            .icon-auditTrail-interaction path {
                                fill: var(--icon-line-color, #555555);
                                stroke: none;
                                stroke-width: 1px;
                                fill-rule: evenodd;
                            }
                        </style>
                        <g>
                            <path d="M47.3545,15.9997 C47.4885,15.9997 47.6195,16.0277 47.7415,16.0777 C47.8615,16.1287 47.9695,16.2017 48.0615,16.2927 L56.6885,24.9957 C56.9985,25.1657 57.2155,25.4837 57.2155,25.8617 C57.2155,25.8747 57.2085,25.8867 57.2075,25.9007 C57.2085,25.9137 57.2155,25.9257 57.2155,25.9397 L57.2155,41.6757 C57.2155,42.2287 56.7685,42.6757 56.2155,42.6757 C55.6635,42.6757 55.2155,42.2287 55.2155,41.6757 L55.2155,26.8617 L47.3535,26.8617 C46.8015,26.8617 46.3535,26.4137 46.3535,25.8617 L46.3535,17.9997 L24.9995,17.9997 L24.9995,58.9937 L41.1315,58.9937 C41.6845,58.9937 42.1315,59.4417 42.1315,59.9937 C42.1315,60.5467 41.6845,60.9937 41.1315,60.9937 L23.9995,60.9937 C23.4475,60.9937 22.9995,60.5467 22.9995,59.9937 L22.9995,16.9997 C22.9995,16.4477 23.4475,15.9997 23.9995,15.9997 
                            Z M39.2728104,46.5 L39.2728104,47.5 L35.5,47.5 L35.5,52.5 L40.5,52.5 L40.5,50.2665991 L41.5,50.2665991 L41.5,53.5 L34.5,53.5 L34.5,46.5 L39.2728104,46.5 
                            Z M30,23.5 C31.3807119,23.5 32.5,24.6192881 32.5,26 C32.5,27.2093254 31.6413382,28.2180997 30.5004345,28.4499027 L30.5004345,31.5500973 C31.6413382,31.7819003 32.5,32.7906746 32.5,34 C32.5,35.2093254 31.6413382,36.2180997 30.5004345,36.4499027 L30.5004345,39.5500973 C31.6413382,39.7819003 32.5,40.7906746 32.5,42 C32.5,43.2093254 31.6413382,44.2180997 30.5004345,44.4499027 L30.5004345,47.5500973 C31.6413382,47.7819003 32.5,48.7906746 32.5,50 C32.5,51.3807119 31.3807119,52.5 30,52.5 C28.6192881,52.5 27.5,51.3807119 27.5,50 C27.5,48.7906746 28.3586618,47.7819003 29.4995655,47.5500973 L29.4995655,44.4499027 C28.3586618,44.2180997 27.5,43.2093254 27.5,42 C27.5,40.7906746 28.3586618,39.7819003 29.4995655,39.5500973 L29.4995655,36.4499027 C28.3586618,36.2180997 27.5,35.2093254 27.5,34 C27.5,32.7906746 28.3586618,31.7819003 29.4995655,31.5500973 L29.4995655,28.4499027 C28.3586618,28.2180997 27.5,27.2093254 27.5,26 C27.5,24.6192881 28.6192881,23.5 30,23.5 
                            Z M30,48.5 C29.1715729,48.5 28.5,49.1715729 28.5,50 C28.5,50.8284271 29.1715729,51.5 30,51.5 C30.8284271,51.5 31.5,50.8284271 31.5,50 C31.5,49.1715729 30.8284271,48.5 30,48.5 
                            Z M42.843043,46.1485487 C43.0516523,46.3470135 43.0516523,46.6687887 42.843043,46.8672535 L38.6558261,50.8508513 C38.4472168,51.0493162 38.1089943,51.0493162 37.900385,50.8508513 L36.155957,49.1912527 C35.9473477,48.9927878 35.9473477,48.6710127 36.155957,48.4725478 C36.3645662,48.2740829 36.7027887,48.2740829 36.911398,48.4725478 L38.2778385,49.7726023 L42.087602,46.1485487 C42.2962113,45.9500838 42.6344338,45.9500838 42.843043,46.1485487 
                            Z M30,40.5 C29.1715729,40.5 28.5,41.1715729 28.5,42 C28.5,42.8284271 29.1715729,43.5 30,43.5 C30.8284271,43.5 31.5,42.8284271 31.5,42 C31.5,41.1715729 30.8284271,40.5 30,40.5 
                            Z M49.5,41 C49.7761424,41 50,41.2238576 50,41.5 C50,41.7761424 49.7761424,42 49.5,42 L34.5,42 C34.2238576,42 34,41.7761424 34,41.5 C34,41.2238576 34.2238576,41 34.5,41 L49.5,41 
                            Z M30,32.5 C29.1715729,32.5 28.5,33.1715729 28.5,34 C28.5,34.8284271 29.1715729,35.5 30,35.5 C30.8284271,35.5 31.5,34.8284271 31.5,34 C31.5,33.1715729 30.8284271,32.5 30,32.5 
                            Z M49.5,33 C49.7761424,33 50,33.2238576 50,33.5 C50,33.7761424 49.7761424,34 49.5,34 L34.5,34 C34.2238576,34 34,33.7761424 34,33.5 C34,33.2238576 34.2238576,33 34.5,33 L49.5,33 
                            Z M30,24.5 C29.1715729,24.5 28.5,25.1715729 28.5,26 C28.5,26.8284271 29.1715729,27.5 30,27.5 C30.8284271,27.5 31.5,26.8284271 31.5,26 C31.5,25.1715729 30.8284271,24.5 30,24.5 
                            Z M40.5,25 C40.7761424,25 41,25.2238576 41,25.5 C41,25.7761424 40.7761424,26 40.5,26 L34.5,26 C34.2238576,26 34,25.7761424 34,25.5 C34,25.2238576 34.2238576,25 34.5,25 L40.5,25 
                            Z M48.3535,19.4287 L48.3535,24.8617 L53.7385,24.8617 L48.3535,19.4287 Z" ></path>
                        </g>
                        <svg class="icon-auditTrail-interaction-internal" x="40px" y="40px" height="32px" width="32px" viewBox="0 0 80 80">
                            <defs>
                                <style>			
                                    .icon-auditTrail-interaction-internal path,
                                    .icon-auditTrail-interaction-internal polyline,
                                    .icon-auditTrail-interaction-internal line
                                    {
                                        fill: none;
                                        stroke: var(--icon-line-color, #555555);
                                        stroke-width: 2px;
                                        fill-rule: evenodd;
                                    }
                                </style>
                            </defs>
                            <g>	
                                <polyline fill="none" stroke="#4794DA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="18.535,23.818 25.809,23.826 25.289,40.002 18.519,39.885"/>	
                                <line fill="none" stroke="#4794DA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="20.757" y1="32.733" x2="20.703" y2="36.185"/>
                                <path fill="none" stroke="#4794DA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M26.564,25.263H33.3l18.736,9.087l5.222,15.45c0,0,0.637,1.494-0.966,2.285c-1.557,0.768-2.468-0.915-2.468-0.915l-6.226-10.692		l0.141,5.212l-7.502,2.396l-5.178-4.024l-4.015-7.405h-5.229"/>
                                <path fill="none" stroke="#4794DA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M60.231,46.532c0.605,0.782,1.025,1.726,1.182,2.772c0.491,3.271-1.762,6.319-5.032,6.81c-3.271,0.491-6.319-1.762-6.81-5.032"/>
                            </g>
                        </svg>                  
                    </svg>
                `
                }
                this._auditTrail = {
                    data: `
                    <svg class="icon-auditTrail" viewBox="0 0 80 80">
                        <style>
                            .icon-auditTrail path {
                                fill: var(--icon-line-color, #555555);
                                stroke: none;
                                stroke-width: 1px;
                                fill-rule: evenodd;
                            }
                        </style>
                        <g>
                            <path d="M60.0469916,61.8170624 L60.0469916,64.4962257 C60.0469916,64.7744526 59.8179008,65 59.535303,65 C59.2527052,65 59.0236144,64.7744526 59.0236144,64.4962257 L59.0236144,62.824611 L52.5344727,62.824611 L52.5344727,64.4962257 C52.5344727,64.7744526 52.3053819,65 52.0227841,65 C51.7401863,65 51.5110955,64.7744526 51.5110955,64.4962257 L51.5110955,61.8170624 L60.0469916,61.8170624 Z M52.1575949,56.1936617 L52.3105296,56.406429 C52.3316011,56.4357417 52.3892743,56.5041479 52.4849765,56.5990192 C52.6534251,56.7660054 52.8631334,56.9350325 53.1156878,57.0940157 C53.8501949,57.5563884 54.7796207,57.8356654 55.9292939,57.8356654 C57.0821634,57.8356654 58.0422365,57.5544566 58.8238948,57.0877067 C59.0940037,56.9264172 59.3218823,56.7546669 59.5079852,56.5846913 C59.6145391,56.4873712 59.680456,56.4164334 59.7061191,56.3845529 L59.7149086,56.3728807 C59.7285339,56.3569731 59.7431415,56.3419078 59.7586394,56.3277755 L59.772524,56.3162068 C59.8320097,56.2650709 59.9037527,56.2277323 59.9827365,56.2084575 C59.9912688,56.2066745 59.9997093,56.2048223 60.0081888,56.203181 L60.051,56.197 L60.105,56.193 L60.3749557,56.1983456 C63.2613311,56.2971897 64.9263771,57.9690584 65.6213757,60.648388 C65.9258592,61.8222199 66,62.8309359 66,64.3095773 C66,64.5878042 65.7709092,64.8133516 65.4883114,64.8133516 C65.2057136,64.8133516 64.9766228,64.5878042 64.9766228,64.3095773 C64.9766228,62.9100897 64.9073504,61.9676108 64.629822,60.897695 C64.0392582,58.6209781 62.7242558,57.291773 60.3551121,57.205689 L60.332,57.205 L60.2151678,57.3182896 C60.0032836,57.5133389 59.7172949,57.7326136 59.3545996,57.949189 C58.4176311,58.5086789 57.275497,58.843214 55.9292939,58.843214 C54.5798946,58.843214 53.4601428,58.5067472 52.5644057,57.94288 C52.1578931,57.6869801 51.8568672,57.4267694 51.65351,57.205352 C49.2788582,57.2882372 47.9613754,58.6179314 47.3701234,60.8976758 C47.0926386,61.9675992 47.0233772,62.9100835 47.0233772,64.3095773 C47.0233772,64.5878042 46.7942864,64.8133516 46.5116886,64.8133516 C46.2290908,64.8133516 46,64.5878042 46,64.3095773 C46,62.8309421 46.0741283,61.8222315 46.3785598,60.6484072 C47.0951597,57.8853474 48.8432312,56.1936617 51.8928617,56.1936617 L52.1575949,56.1936617 Z M47.3545,15.9997 C47.4885,15.9997 47.6195,16.0277 47.7415,16.0777 C47.8615,16.1287 47.9695,16.2017 48.0615,16.2927 L56.6885,24.9957 C56.9985,25.1657 57.2155,25.4837 57.2155,25.8617 C57.2155,25.8747 57.2085,25.8867 57.2075,25.9007 C57.2085,25.9137 57.2155,25.9257 57.2155,25.9397 L57.2155,41.6757 C57.2155,42.2287 56.7685,42.6757 56.2155,42.6757 C55.6635,42.6757 55.2155,42.2287 55.2155,41.6757 L55.2155,26.8617 L47.3535,26.8617 C46.8015,26.8617 46.3535,26.4137 46.3535,25.8617 L46.3535,17.9997 L24.9995,17.9997 L24.9995,58.9937 L41.1315,58.9937 C41.6845,58.9937 42.1315,59.4417 42.1315,59.9937 C42.1315,60.5467 41.6845,60.9937 41.1315,60.9937 L23.9995,60.9937 C23.4475,60.9937 22.9995,60.5467 22.9995,59.9937 L22.9995,16.9997 C22.9995,16.4477 23.4475,15.9997 23.9995,15.9997 Z M55.9067564,45 C58.807708,45 61.1385164,47.3212404 61.1385164,50.1904324 C61.1385164,50.4686593 60.9094256,50.6942067 60.6268278,50.6942067 C60.5786329,50.6942067 60.5319941,50.6876467 60.4877826,50.6753842 L60.4889045,52.156549 C60.4889045,54.6357463 58.5000504,56.634324 56,56.634324 C53.5001074,56.634324 51.5110955,54.6358931 51.5110955,52.156549 L51.5113084,50.5787886 C51.4227906,50.6508831 51.3092138,50.6942067 51.1853592,50.6942067 C50.9027614,50.6942067 50.6736706,50.4686593 50.6736706,50.1904324 C50.6736706,47.3208706 53.00441,45 55.9067564,45 Z M53.4723497,49.8545245 L52.5344727,50.5098276 L52.5344727,52.156549 C52.5344727,54.0839686 54.0700079,55.6267754 56,55.6267754 C57.9301141,55.6267754 59.4655273,54.0838555 59.4655273,52.156549 L59.4655273,50.8490736 L54.0775781,51.7763029 L53.4723497,49.8545245 Z M39.2728104,46.5 L39.2728104,47.5 L35.5,47.5 L35.5,52.5 L40.5,52.5 L40.5,50.2665991 L41.5,50.2665991 L41.5,53.5 L34.5,53.5 L34.5,46.5 L39.2728104,46.5 Z M30,23.5 C31.3807119,23.5 32.5,24.6192881 32.5,26 C32.5,27.2093254 31.6413382,28.2180997 30.5004345,28.4499027 L30.5004345,31.5500973 C31.6413382,31.7819003 32.5,32.7906746 32.5,34 C32.5,35.2093254 31.6413382,36.2180997 30.5004345,36.4499027 L30.5004345,39.5500973 C31.6413382,39.7819003 32.5,40.7906746 32.5,42 C32.5,43.2093254 31.6413382,44.2180997 30.5004345,44.4499027 L30.5004345,47.5500973 C31.6413382,47.7819003 32.5,48.7906746 32.5,50 C32.5,51.3807119 31.3807119,52.5 30,52.5 C28.6192881,52.5 27.5,51.3807119 27.5,50 C27.5,48.7906746 28.3586618,47.7819003 29.4995655,47.5500973 L29.4995655,44.4499027 C28.3586618,44.2180997 27.5,43.2093254 27.5,42 C27.5,40.7906746 28.3586618,39.7819003 29.4995655,39.5500973 L29.4995655,36.4499027 C28.3586618,36.2180997 27.5,35.2093254 27.5,34 C27.5,32.7906746 28.3586618,31.7819003 29.4995655,31.5500973 L29.4995655,28.4499027 C28.3586618,28.2180997 27.5,27.2093254 27.5,26 C27.5,24.6192881 28.6192881,23.5 30,23.5 Z M30,48.5 C29.1715729,48.5 28.5,49.1715729 28.5,50 C28.5,50.8284271 29.1715729,51.5 30,51.5 C30.8284271,51.5 31.5,50.8284271 31.5,50 C31.5,49.1715729 30.8284271,48.5 30,48.5 Z M42.843043,46.1485487 C43.0516523,46.3470135 43.0516523,46.6687887 42.843043,46.8672535 L38.6558261,50.8508513 C38.4472168,51.0493162 38.1089943,51.0493162 37.900385,50.8508513 L36.155957,49.1912527 C35.9473477,48.9927878 35.9473477,48.6710127 36.155957,48.4725478 C36.3645662,48.2740829 36.7027887,48.2740829 36.911398,48.4725478 L38.2778385,49.7726023 L42.087602,46.1485487 C42.2962113,45.9500838 42.6344338,45.9500838 42.843043,46.1485487 Z M55.9067564,46.0075486 C53.688076,46.0075486 51.8842964,47.6940511 51.7107293,49.8491646 L54.0316287,48.2282593 L54.7883758,50.6311544 L60.0889591,49.7192634 C59.8548727,47.626928 58.0793112,46.0075486 55.9067564,46.0075486 Z M30,40.5 C29.1715729,40.5 28.5,41.1715729 28.5,42 C28.5,42.8284271 29.1715729,43.5 30,43.5 C30.8284271,43.5 31.5,42.8284271 31.5,42 C31.5,41.1715729 30.8284271,40.5 30,40.5 Z M49.5,41 C49.7761424,41 50,41.2238576 50,41.5 C50,41.7761424 49.7761424,42 49.5,42 L34.5,42 C34.2238576,42 34,41.7761424 34,41.5 C34,41.2238576 34.2238576,41 34.5,41 L49.5,41 Z M30,32.5 C29.1715729,32.5 28.5,33.1715729 28.5,34 C28.5,34.8284271 29.1715729,35.5 30,35.5 C30.8284271,35.5 31.5,34.8284271 31.5,34 C31.5,33.1715729 30.8284271,32.5 30,32.5 Z M49.5,33 C49.7761424,33 50,33.2238576 50,33.5 C50,33.7761424 49.7761424,34 49.5,34 L34.5,34 C34.2238576,34 34,33.7761424 34,33.5 C34,33.2238576 34.2238576,33 34.5,33 L49.5,33 Z M30,24.5 C29.1715729,24.5 28.5,25.1715729 28.5,26 C28.5,26.8284271 29.1715729,27.5 30,27.5 C30.8284271,27.5 31.5,26.8284271 31.5,26 C31.5,25.1715729 30.8284271,24.5 30,24.5 Z M40.5,25 C40.7761424,25 41,25.2238576 41,25.5 C41,25.7761424 40.7761424,26 40.5,26 L34.5,26 C34.2238576,26 34,25.7761424 34,25.5 C34,25.2238576 34.2238576,25 34.5,25 L40.5,25 Z M48.3535,19.4287 L48.3535,24.8617 L53.7385,24.8617 L48.3535,19.4287 Z" ></path>
                        </g>
                    </svg>
                `
                }
                this._auditTrailError = {
                    data: `
                    <svg class="icon-auditTrail-connection-error" viewBox="0 0 80 80">
                        <style>
                            .icon-auditTrail-connection-error path {
                                fill: var(--icon-line-color, #555555);
                                stroke: none;
                                stroke-width: 1px;
                                fill-rule: evenodd;
                            }
                        </style>
                        <g>
                            <path d="M47.3545,15.9997 C47.4885,15.9997 47.6195,16.0277 47.7415,16.0777 C47.8615,16.1287 47.9695,16.2017 48.0615,16.2927 L56.6885,24.9957 C56.9985,25.1657 57.2155,25.4837 57.2155,25.8617 C57.2155,25.8747 57.2085,25.8867 57.2075,25.9007 C57.2085,25.9137 57.2155,25.9257 57.2155,25.9397 L57.2155,41.6757 C57.2155,42.2287 56.7685,42.6757 56.2155,42.6757 C55.6635,42.6757 55.2155,42.2287 55.2155,41.6757 L55.2155,26.8617 L47.3535,26.8617 C46.8015,26.8617 46.3535,26.4137 46.3535,25.8617 L46.3535,17.9997 L24.9995,17.9997 L24.9995,58.9937 L41.1315,58.9937 C41.6845,58.9937 42.1315,59.4417 42.1315,59.9937 C42.1315,60.5467 41.6845,60.9937 41.1315,60.9937 L23.9995,60.9937 C23.4475,60.9937 22.9995,60.5467 22.9995,59.9937 L22.9995,16.9997 C22.9995,16.4477 23.4475,15.9997 23.9995,15.9997 
                            Z M39.2728104,46.5 L39.2728104,47.5 L35.5,47.5 L35.5,52.5 L40.5,52.5 L40.5,50.2665991 L41.5,50.2665991 L41.5,53.5 L34.5,53.5 L34.5,46.5 L39.2728104,46.5 
                            Z M30,23.5 C31.3807119,23.5 32.5,24.6192881 32.5,26 C32.5,27.2093254 31.6413382,28.2180997 30.5004345,28.4499027 L30.5004345,31.5500973 C31.6413382,31.7819003 32.5,32.7906746 32.5,34 C32.5,35.2093254 31.6413382,36.2180997 30.5004345,36.4499027 L30.5004345,39.5500973 C31.6413382,39.7819003 32.5,40.7906746 32.5,42 C32.5,43.2093254 31.6413382,44.2180997 30.5004345,44.4499027 L30.5004345,47.5500973 C31.6413382,47.7819003 32.5,48.7906746 32.5,50 C32.5,51.3807119 31.3807119,52.5 30,52.5 C28.6192881,52.5 27.5,51.3807119 27.5,50 C27.5,48.7906746 28.3586618,47.7819003 29.4995655,47.5500973 L29.4995655,44.4499027 C28.3586618,44.2180997 27.5,43.2093254 27.5,42 C27.5,40.7906746 28.3586618,39.7819003 29.4995655,39.5500973 L29.4995655,36.4499027 C28.3586618,36.2180997 27.5,35.2093254 27.5,34 C27.5,32.7906746 28.3586618,31.7819003 29.4995655,31.5500973 L29.4995655,28.4499027 C28.3586618,28.2180997 27.5,27.2093254 27.5,26 C27.5,24.6192881 28.6192881,23.5 30,23.5 
                            Z M30,48.5 C29.1715729,48.5 28.5,49.1715729 28.5,50 C28.5,50.8284271 29.1715729,51.5 30,51.5 C30.8284271,51.5 31.5,50.8284271 31.5,50 C31.5,49.1715729 30.8284271,48.5 30,48.5 
                            Z M42.843043,46.1485487 C43.0516523,46.3470135 43.0516523,46.6687887 42.843043,46.8672535 L38.6558261,50.8508513 C38.4472168,51.0493162 38.1089943,51.0493162 37.900385,50.8508513 L36.155957,49.1912527 C35.9473477,48.9927878 35.9473477,48.6710127 36.155957,48.4725478 C36.3645662,48.2740829 36.7027887,48.2740829 36.911398,48.4725478 L38.2778385,49.7726023 L42.087602,46.1485487 C42.2962113,45.9500838 42.6344338,45.9500838 42.843043,46.1485487 
                            Z M30,40.5 C29.1715729,40.5 28.5,41.1715729 28.5,42 C28.5,42.8284271 29.1715729,43.5 30,43.5 C30.8284271,43.5 31.5,42.8284271 31.5,42 C31.5,41.1715729 30.8284271,40.5 30,40.5 
                            Z M49.5,41 C49.7761424,41 50,41.2238576 50,41.5 C50,41.7761424 49.7761424,42 49.5,42 L34.5,42 C34.2238576,42 34,41.7761424 34,41.5 C34,41.2238576 34.2238576,41 34.5,41 L49.5,41 
                            Z M30,32.5 C29.1715729,32.5 28.5,33.1715729 28.5,34 C28.5,34.8284271 29.1715729,35.5 30,35.5 C30.8284271,35.5 31.5,34.8284271 31.5,34 C31.5,33.1715729 30.8284271,32.5 30,32.5 
                            Z M49.5,33 C49.7761424,33 50,33.2238576 50,33.5 C50,33.7761424 49.7761424,34 49.5,34 L34.5,34 C34.2238576,34 34,33.7761424 34,33.5 C34,33.2238576 34.2238576,33 34.5,33 L49.5,33 
                            Z M30,24.5 C29.1715729,24.5 28.5,25.1715729 28.5,26 C28.5,26.8284271 29.1715729,27.5 30,27.5 C30.8284271,27.5 31.5,26.8284271 31.5,26 C31.5,25.1715729 30.8284271,24.5 30,24.5 
                            Z M40.5,25 C40.7761424,25 41,25.2238576 41,25.5 C41,25.7761424 40.7761424,26 40.5,26 L34.5,26 C34.2238576,26 34,25.7761424 34,25.5 C34,25.2238576 34.2238576,25 34.5,25 L40.5,25 
                            Z M48.3535,19.4287 L48.3535,24.8617 L53.7385,24.8617 L48.3535,19.4287 Z" ></path>
                        </g>
                        <svg class="icon-auditTrail-connection-error-internal" x="40px" y="40px" height="32px" width="32px" viewBox="0 0 80 80">
                            <defs>
                                <style>			
                                    .icon-auditTrail-connection-error-internal path,
                                    .icon-auditTrail-connection-error-internal rect,
                                    .icon-auditTrail-connection-error-internal line
                                    {
                                        fill: none;
                                        stroke: var(--icon-line-color-error, #EF0000);
                                        stroke-width: 2px;
                                        fill-rule: evenodd;
                                    }

                                    .icon-auditTrail-connection-error-internal path {
                                        stroke-miterlimit: 10;
                                    }

                                    .icon-auditTrail-connection-error-internal rect,
                                        line {
                                        stroke-linecap: round;
                                        stroke-linejoin: round;
                                    }
                                </style>
                            </defs>
                            <path d="M53.4679,43.5332a9.03363,9.03363,0,0,0,1.3214-17.9749A10.10956,10.10956,0,0,0,36.764,19.4084a9.01439,9.01439,0,0,0-12.5572,6.3491,9.03514,9.03514,0,0,0,2.3187,17.7757"/>
                            <rect x="30.7938" y="33.0002" width="4.125" height="4.125"/>
                            <rect x="30.7938" y="56.938" width="4.125" height="4.125"/>
                            <rect x="19.6983" y="56.938" width="4.125" height="4.125"/>
                            <line x1="32.8559" y1="37.1252" x2="32.8556" y2="56.938"/>
                            <path d="M32.8559,37.1252c0,11.9795-11.0951,10.271-11.0951,19.8128"/>
                            <line x1="42.429" y1="38.543" x2="54.064" y2="50.122"/>
                            <line x1="42.429" y1="50.273" x2="54.064" y2="38.694"/>
                        </svg>
                    </svg>
                `
                }
            }

            getUser() {
                return this._user;
            }

            getMessage() {
                return this._message;
            }

            getRecipe() {
                return this._recipe;
            }

            getAuditTrailInteraction() {
                return this._auditTrailInteraction;
            }

            getAuditTrail() {
                return this._auditTrail;
            }

            getAuditTrailError() {
                return this._auditTrailError;
            }
        }
        Images.Icons = Icons;
    })(Images = Reporting.Images || (Reporting.Images = {}));
})(Reporting);
