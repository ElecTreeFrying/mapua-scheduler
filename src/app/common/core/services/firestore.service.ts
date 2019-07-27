import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { map, switchMap, first } from 'rxjs/operators'
import * as _ from 'lodash';
import { Term, Schedule } from '../../shared/interfaces/firestore';

import { AuthService } from './auth.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private user_data: AngularFirestoreCollection<any>
  private data_list: AngularFirestoreCollection<any>
  student_list: AngularFirestoreCollection<any>
  schedule_list: AngularFirestoreCollection<any>

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService,
    private shared: SharedService,
  ) {
    this.user_data = firestore.collection<any>('user-data');
    this.data_list = firestore.collection<any>('data-list');
    this.student_list = firestore.collection<any>('student-list');
    this.schedule_list = firestore.collection<any>('schedule-list');
  }
  
  dataList(professor?: string) {
    
    const data = this.data_list.snapshotChanges().pipe(
      map((db) => {
        const data = db.map((fire) => fire.payload.doc.data());
        return _.sortBy(data, [ a => a.id ]);
      }),
    );
    
    return this.auth.onlineUserData().pipe(
      switchMap((user) => {
        return data.pipe(
          map((_data) => {
            if (user.assignment === 'student') {
              return _data.filter(a => a.professor === professor);
            } else {
              return _data.filter(a => a.professor === user.name);
            }
          })
        )
      })
    )
  }
  
  get users() {
    return this.user_data.snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          const doc = fire.payload.doc;
          return { id: doc.id, ...doc.data() };
        })
      }),
      map((doc: any[]) => {
        
        const users = doc.map((a) => {
          if (a['assignment'] === 'professor') {
            a['name'] = `${a['title']} ${a['firstname']} ${a['lastname']}`
            return a;
          }
        });
        return _.filter(users);
      })
    )
  }
  
  get schedules() {
    
    const data = this.schedule_list.snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          const data = fire.payload.doc.data();
          const pushId = fire.payload.doc.id;
          return { ...data, pushId };
        });
      }),
    );
    
    return this.auth.onlineUserData().pipe(
      switchMap((user) => {
        return data.pipe(
          map((_data) => {
            return _data.filter(a => a.professor === user.name);
          })
        )
      })
    )
  }
  
  daySchedule(data: any, user?: any) {
    
    data['_day'] = data.day;
    delete data['day'];
    delete data['professor'];
    
    const online = this.auth.onlineUserData();
    
    return this.schedule_list.snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          const data = fire.payload.doc.data();
          const pushId = fire.payload.doc.id;
          return { ...data, pushId };
        })
      }),
      map((schedule: any[]) => {
        return schedule.map((sched) => {
          const indicator = data.schedule.includes(sched.day);
          if (indicator) {
            return { ...sched, ...data };
          }
        })
      }),
      map((schedule: any[]) => {
        return _.filter(schedule)
      }),
      switchMap((sched: any[]) => {
        return online.pipe(
          map((_online: any) => {
            if (_online.assignment === 'professor') {
              return sched.filter(a => a.professor === _online.name)
            } else {
              return sched.filter(a => a.professor === user.name)
            }
          })
        )
      })
    )
  }
  
  addSchedule(sched: Schedule) {
    
    this.auth.onlineUserData().subscribe((data: any) => {

      sched.professor = data.name;
      sched.indicator = 'white';
      this.schedule_list.add(sched);
    });
  }
  
  findSchedule(id: string) {

    return this.schedule_list.snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          const id = fire.payload.doc.id;
          const doc = fire.payload.doc.data();
          return { id, ...doc };
        })
      }),
      map((doc: any[]) => {
        return doc.filter(e => e.id === id)[0];
      })
    )
  }
  
  set updateSchedule(schedule: any) {
    
    let counter = 0;
    this.schedule_list.snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          
          const doc = fire.payload.doc;
          if (doc.id !== schedule.id || counter > 0) return;
          doc.ref.update({
            day: schedule.day,
            time: schedule.time,
            course: schedule.course,
            section: schedule.section,
            room: schedule.room,
            label: schedule.label,
            professor: schedule.professor,
          })
          counter++;
          
        })
      })
    ).subscribe(() => 0);
  }
  
  set removeSchedule(id: string) {
    this.schedule_list.snapshotChanges([]).pipe(
      map((db) => {
        return db.map((fire) => {
          
          const doc = fire.payload.doc;
          if (doc.id === id) { doc.ref.delete(); }
        })
      }),
    ).subscribe(() => 0);
  }
  
  addStudent(data: any) {

    let counter = 0;
    const online = this.auth.onlineUserData();
    
    const obs = this.schedule_list.snapshotChanges().pipe(
      switchMap((sched) => {
        return online.pipe(
          map((_online) => {
            return sched.map((a) => {
              a['user'] = _online;
              return a;
            });
          })
        )
      }),
      map((db) => {
        return db.map((fire: any) => {
          const doc = fire.payload.doc;
          
          if (counter > 1) return;
          if (doc.id === data['pushId']) {
          
            const stud = data['student'] as any[];
            stud.forEach((a) => {
              a['id'] = doc.id;
              a['groupname'] = data.groupname;
              a['purpose'] = data.purpose;
              a['status'] = 'pending';
              a['date'] = data.date;
              a['day'] = data.day;
              a['month'] = data.month;
              a['professor'] = data.professor;
              this.student_list.add(a);
            });
            
            doc.ref.update({
              status: 'pending',
              indicator: data['indicator']
            });
          
            counter++;
            obs.unsubscribe();
          }
        })
      })
    ).subscribe(() => 0);
  }
  
  resetSchedule(option: boolean = true, monthConfig?: any, user?: any) {
    let counter = 0;

    var buffer = 'go';
    const obs = this.firestore.collection<any>('data-list', (ref) => {
      return ref.where('professor', '==', user.name)
    }).snapshotChanges([]).pipe(
      first(),
      map((db: any[]) => {
        return db.map((fire) => {
          if (buffer === 'stop') {
            this.removeAllStudents(user.name);
            this.removeAllSchedules(user.name);
            obs.unsubscribe();
            return;
          }
          fire.payload.doc.ref.delete();
        })
      }),
      map((db: any[]) => {
        if (counter > 0) return;
        db.length === 0 ? (() => {
            obs.unsubscribe();
            counter++;
            buffer = 'stop';
            this.testData(false, monthConfig, user.name)
          })() : 0;
        }),
      ).subscribe(() => 0);
    
  }

  getStudentsByGroup(data: any) {
    
    console.log(data);
    
    return this.student_list.snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {

          const doc = fire.payload.doc;
          
          if (data.pushId !== doc.data().id) return;
          return { id: doc.id, ...doc.data() };
        })
      }),
      map((doc) => {
        
        doc = _.filter(doc);
        const data = [];
        const uniqGroupname = doc
          .map(i => i.groupname)
          .filter((v, i, s) => s.indexOf(v) === i)
        
        uniqGroupname.forEach((groupname) => {
          data.push({
            groupname,
            status: doc.filter((a) => a.groupname === groupname)[0].status,
            purpose: doc.filter((a) => a.groupname === groupname)[0].purpose,
            students: doc.filter((a) => a.groupname === groupname)
          })
        })
        
        return data;
      })
    )
  }

  acceptStudents(groupname: string, data: any, students: any[]) {

    var counter = 0;
    const obs2 = this.student_list.snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          const doc = fire.payload.doc;
          const docData = doc.data();
          const date = docData.date;
          const day = docData.day;
          const month = docData.month;
          const professor = docData.professor;
          const _groupname = docData.groupname;
          
          const condition = date === data.date
            && day === data.day
            && month === data.month
            && professor === data.professor
            && _groupname !== groupname
            
          if (condition) {
            
            doc.ref.delete();
            
            setTimeout(() => {
              obs2.unsubscribe();
            }, 4000);
          }
        })
      }),
    ).subscribe(() => 0);
    
    const obs1 = this.student_list.snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          const doc = fire.payload.doc;
          const docData = doc.data();
          const date = docData.date;
          const day = docData.day;
          const month = docData.month;
          const professor = docData.professor;
          const _groupname = docData.groupname;
          
          const condition = date === data.date
            && day === data.day
            && month === data.month
            && professor === data.professor
            && _groupname === groupname
          
          if (condition) {
            
            doc.ref.update({
              status: 'accepted'
            }).then(() => {
              if (counter > 0) return;
              toBlue();
              counter++;
            });
          }
          
        })
      }),
    ).subscribe(() => 0);
    
    const toBlue = () => {
      let counter = 0;
      const obs = this.schedule_list.snapshotChanges().pipe(
        map((db) => {
          return db.map((fire) => {
            const doc = fire.payload.doc;
            
            if (counter > 1) return;
            if (doc.id === data.pushId) {
            
              doc.ref.update({
                status: 'accepted',
                indicator: 'blue'
              }).then(() => {
                counter++;
                obs.unsubscribe();
              });
            
            }
          })
        })
      ).subscribe(() => 0);
    }
    
  }
  
  rejectRemoveStudents(groupname: string, data: any, option: boolean) {
    
    const obs = this.student_list.snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          const doc = fire.payload.doc;
          const docData = doc.data();
          const date = docData.date;
          const day = docData.day;
          const month = docData.month;
          const professor = docData.professor;
          const _groupname = docData.groupname;
          
          const condition = date === data.date
            && day === data.day
            && month === data.month
            && professor === data.professor
            && _groupname === groupname
            
          if (condition) {
            doc.ref.delete();
            toOrange();
            setTimeout(() => {
              obs.unsubscribe();
            }, 4000);
          }
        })
      }),
    ).subscribe(() => 0);
    
    const toOrange = () => {
      let counter = 0;
      const obs = this.schedule_list.snapshotChanges().pipe(
        map((db) => {
          return db.map((fire) => {
            const doc = fire.payload.doc;
            
            if (counter > 1) return;
            if (doc.id === data.pushId) {
            
              option
                ? doc.ref.update({
                status: 'pending',
                indicator: 'orange'
                })
                : doc.ref.update({
                status: 'none',
                indicator: 'white'
                });
            
              counter++;
              obs.unsubscribe();
            }
          })
        })
      ).subscribe(() => 0);
    }
  }
  
  checkIndicator(current) {
    
    if (current === undefined) return;
    
    return this.student_list.snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          const doc = fire.payload.doc;
          return { id: doc.id, ...doc.data() };
        })
      }),
      map((doc: any[]) => {
        let data = doc.filter((_doc) => {
          const _date = _doc.date === current.date;
          const _day = _doc.day === current.day;
          const  _month = _doc.month === current.month;
          const  _id = _doc.id === current.pushId;
          return _date && _day && _month && _id;
        });
        
        if (data.length === 0) {
          return { color: 'white', isShowConsultation: true, isShowVisibility: false };
        } else {
          
          if (data[0].status === 'pending') {
            return { color: 'orange', isShowConsultation: true, isShowVisibility: true };
          } else {
            return { color: 'blue', isShowConsultation: false, isShowVisibility: true };
          }
          
        }
      })
    )
    
  }
  
  checkIndicatorStudents(current, value) {
    
    if (current === undefined) return;
    
    return this.student_list.snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          const doc = fire.payload.doc;
          return { id: doc.id, ...doc.data() };
        })
      }),
      map((doc: any[]) => {
        let data = doc.filter((_doc) => {
          const _date = _doc.date === current.date;
          const _day = _doc.day === current.day;
          const  _month = _doc.month === current.month;
          const  _id = _doc.id === current.pushId;
          return _date && _day && _month && _id;
        });
        
        return data;
      }),
      map((doc) => {
        
        doc = _.filter(doc);
        const data = [];
        const uniqGroupname = doc
          .map(i => i.groupname)
          .filter((v, i, s) => s.indexOf(v) === i)
        
        uniqGroupname.forEach((groupname) => {
          data.push({
            groupname,
            status: doc.filter((a) => a.groupname === groupname)[0].status,
            purpose: doc.filter((a) => a.groupname === groupname)[0].purpose,
            students: doc.filter((a) => a.groupname === groupname)
          })
        })
        
        return data;
      })
    )
    
  }
  
  checkContainStudents(day: any, user: any) {
    
    const online = this.auth.onlineUserData();
    
    return this.student_list.snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          const doc = fire.payload.doc;
          return { id: doc.id, ...doc.data() };
        })
      }),
      switchMap((stud) => {
        return online.pipe(
          map((_online) => {
            return stud.map((a) => {
              
              if (_online.assignment === 'professor') {
                a['online'] = _online.name;
                return a;
              } else {
                a['online'] = user.name;
                return a;
              }
            });
          })
        )
      }),
      map((doc: any[]) => {
        
        if (doc.length === 0) return;
        const prof = doc[0].online;
        const data = doc.filter((_doc) => {
          const _date = _doc.date === day.date;
          const  _month = _doc.month === day.month;
          return _date && _month;
        }).filter(a => a.professor === prof );
        
        if (data.length === 0) {
          return 'none';
        } else {
          return '1px solid red';
        }
      })
    )
  }
  
  // helper functions
  
  private pushData(data: any) {
    this.data_list.add(data);
  }
  
  testData(option: boolean = true, monthConfig?: any, name?: string) {
    if (option) {
      
      console.log('not');
      
      this.data_list.valueChanges().subscribe((data: Term[]) => {
        console.log(data);
      });
    } else {
      
      console.log('clicked');

      let counter = 0;

      const newConfig = [
        monthConfig['set1'], monthConfig['set2'], monthConfig['set3'], monthConfig['set4']
      ];
      
      this.firestore.collection('data-list', (ref) => {
        return ref.where('professor', '==', name)
      }).valueChanges().subscribe((data: Term[]) => {

        if (data.length !== 0) return;
        
        console.log('0');
        if (counter === 0) {
          console.log('0.0');
          this.dateLoop(newConfig, counter, name)
          counter++;
        }
      
      });
    }
    
  }
  
  private dateLoop(monthConfig: any, counter: number, name: string) {
    
    let data = [];
    
    monthConfig.forEach((a) => {
      for (let i = a.start; i < a.end + 1; i++) {
        data.push({ month: a.month, date: i })
      }
    });

    let data_buffer = 0;
    let data_buffer_counter = 1;
    let data_buffer_counter_data = 1;
    data.map((a, i) => {
      
      a['id'] = i;
      data_buffer = i + 1;

      if (i < 7) {
        const index = data_buffer - 1;
        let day = this.shared.days[index];
        a['day'] = day === 'Su Sunday' || day === 'Th Thursday' ? day.slice(3) : day.slice(2);
        a['schedule_'] = day === 'Su Sunday' ? day.slice(0, 1) : day[0];
        a['schedule'] = this.shared.schedule[a['day']];
        
      } else {
        const index = data_buffer - data_buffer_counter - 1;
        const day = this.shared.days[index];
        a['day'] = day === 'Su Sunday' || day === 'Th Thursday' ? day.slice(3) : day.slice(2);
        a['schedule_'] = day === 'Su Sunday' ? day.slice(0, 1) : day[0];
        
        a['schedule'] = this.shared.schedule[a['day']];
      }
      
      a['week_name'] = this.shared.weeks[data_buffer_counter_data - 1];
      
      if (data_buffer%7 === 0) {
        data_buffer_counter = data_buffer_counter_data;
        data_buffer_counter *= 7;
        data_buffer_counter_data++;
      }
      
      a['professor'] = name;
      
      return a;
    }).map((a) => {
      
      a['tooltip'] = `${a['week_name']} / ${a['day']}`
      
      return a;
    })
    
    data.forEach((a) => {
      this.pushData(a);
    });
    
    this.testData();
  }

  testMe() {
    
    // this.data_list.snapshotChanges().pipe(
    //   map((db) => {
    //     return db.map((fire) => {
    //       const doc = fire.payload.doc;
    //
    //       doc.ref.update({
    //         professor: 'student'
    //       })
    //
    //       return;
    //     })
    //   })
    // ).subscribe(() => 0);
    
    this.firestore.collection<any>('data-list', (ref) => {
      return ref.where('professor', '==', 'Engr. Analyn Yumang')
    }).snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          const doc = fire.payload.doc;
          // doc.ref.delete();
          return { id: doc.id, ...doc.data() };
        })
      }),
      map((doc: any[]) => {
        console.log(doc);
      })
    ).subscribe(() => 0);
    
  }

  private removeAllStudents(name: string) {
    
    var counter = 0;
    this.firestore.collection('student-list', (ref) => {
      return ref.where('professor', '==', name)
    }).snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
      
          if (counter !== 0) return;
          const doc = fire.payload.doc;
      
          console.log((doc.data() as any).professor);
          doc.ref.delete();
        })
      })
    ).subscribe(() => {
      counter++;
    });
  }

  private removeAllSchedules(name: string) {
    
    var counter = 0;
    this.firestore.collection('schedule-list', (ref) => {
      return ref.where('professor', '==', name)
    }).snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
      
          const doc = fire.payload.doc;
          if (counter !== 0) return;
      
          console.log((doc.data() as any).professor);
          doc.ref.delete();
        })
      })
    ).subscribe(() => {
      counter++;
    });
  }

  generate() {
    
    const item = 'professor';
    // const item = 'student';
    const db = this.firestore.collection<any>(`access-codes`)
    
    this.shared.generate.forEach((key) => {
      const object = {
        key,
        assignment: item,
        isTaken: false
      };
      
      db.add(object)
    })
    
  }
  
}
