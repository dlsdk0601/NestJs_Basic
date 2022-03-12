# NestJS Basic

<br />

> src폴더안에 각각의 파일이 하는 역할

<br />

app : 앱 구동 <br />
AppModule : 모든 것의 root 모듈 <br />
AppController : handles routing <br />
AppService : stores controllers for the routers <br />

<br />

# Jest Testing!!!

<br />

이번 레파지토리의 목적은 NestJS 프레임 워크를 익히는것 보단 Jest를 이용하여 Test를 작성해보기 위함이 더 크다. 프론트단에서는 따로 Jest를 인스톨 해줘야하지만, Nest 프레임 워크는 같이 포함되어서 셋팅까지 해주기에 편하게 테스트 해볼 수 있다.

<br />

CRA로 프로젝트를 생성 했을 경우, Jest는 

```console
    npm install --save-dev jest
```

이렇게 설치한다. 

<br />

## 유닛 테스트

<br />

NestJs를 이용하여 Movie.service.ts라는 파일에 무비리스트 CRUD에 관한 API를 만들었는데, Nest를 이용하여 파일을 생성해보니 movies.servies.spec.ts라는 파일이 자동으로 생겨났다. 이 파일은 테스트를 하기 위함 파일이다. 

<br />

describe로 크게 MoviesService에 관한 테스트를 할수 있게 설정되어있다.
Jest의 describe 함수는 설명문과 함께 테스트 코드들을 포함하고 있는 콜백 함수를 지정할 수 있다.

<br />

```movies.service.spec.ts

    import { NotFoundException } from '@nestjs/common';
    import { Test, TestingModule } from '@nestjs/testing';
    import { MoviesService } from './movies.service';

    describe('MoviesService', () => {
        let service: MoviesService;

        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
            providers: [MoviesService],
            }).compile();

            service = module.get<MoviesService>(MoviesService);
        });
    });
```

<br />


먼저 MoviesService라는 describe안에 영화전체 리스트를 가져오는 API에 대해 테스트를 해본다. 그전에 지금 가상의 DB이기 때문에 미리 영화를 생성 해놓는다. beforeEach를 이용하면 된다. 말 그대로 테스트 해보기전 실행되어야하는 셋팅을 해놓을 수 있다. beforeEach외에 afterEach, beforeAll, afterAll등과 같이 다양한 HOOK이 더 있다.

<br />

```beforeEach
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [MoviesService],
        }).compile();

        service = module.get<MoviesService>(MoviesService);

        //test 영화 하나 생성 (service는 만들어 놓은 MoviesService class)
        service.create({
            title: "Test",
            genres: ["test"],
            year: 2000
        });
    });
```

<br />

이제 getAll(영화 전체 리스트)를 테스트 해본다.

<br />

```getAll
    
    describe("getAll", () => {
        it("should retrun an Array", () => {
        const result = service.getAll();
        expect(result).toBeInstanceOf(Array);
        })
    });
```

<br />

간단하게 무비 리스트가 배열의 형태로 오는지 확인 해보는것이다. expect안에 테스트 해보고 싶은 무언가를 넣는다면, 뒤에 다양한 함수를 통해 결과값이 내가 원하는대로 나오는지 테스트 해볼 수 있다. toBeInstanceOf 같은 경우 결과의 타입이 무엇인지 비교해보는 함수이다.

<br />

이번에는 delete API를 테스트 해보면, 결과를 어떻게 비교 해보면 좋을지 많은 방법이 있겠지만, 여기서는 배열의 길이로 측정 했다. delete API를 실행전 리스트와 실행 후 리스트의 length를 비교하여 테스트 해본다

<br />

```delte
  describe("delete", () => {
    it("deletes a movie", () => {
      
      //지우기전 모든 영화 리스트
      const beforeMovie = service.getAll().length;
      
      //id = 1인 영화 지우기
      service.deleteOne(1);

      //지우고 난 후 모든 영화 리스트
      const afterMovie = service.getAll().length;

      //toBeLessThan은 길이가 보다 작냐를 뜻함
      expect(afterMovie).toBeLessThan(beforeMovie);
      
    });

    //Error 테스트
    it("should return a 404", () => {
      try{
        service.deleteOne(999);
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual("Movie with ID 999 not found.")
      }
    });
  });
```

<br />

위 에서는 error 코드도 잘 작동하는지 테스트 해본다. Nest에서 기본으로 제공하는 에러 코드를 사용했고, 에러 코드의 메세지의 결과가 잘 나오는지도 비교 할 수있다.
