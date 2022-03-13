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


## e2e Test

<br />

실제로 단위적으로 테스트 하고 싶을때, 예를 들어 함수 하나 정도의 또는 아주 작은 컴포넌트 하나 정도의 테스트를 위해서는 유닛 테스트가 적당하지만, 두가지의 함수가 서로 엮인다거나, 여러 컴포넌트가 결합하는 등의 경우에는 end To end 테스트가 더 적당하다. 

<br />

테스트 시작전에 beforeEach를 beforeAll로 바꾸어주었다. 바꾸기전에는 각 테스트 마다 어플리케이션을 새로 실행시키면 bofreEach가 실행되지만, beforeAll은 한번 실행되고 테스트가 끝날때까지 유지한다. 

> 주의 사항

테스트를 해보면서, id값으로 영화의 정보를 가져오는 API를 테스트 하는 도중 에러가 발생했다. 포스트맨으로 그리고 브라우저로 테스트 해봤을 경우 아무 문제 없었지만 e2e test에서는 오류가 난다. 왜 일까?

```e2e
  it("GET 200", () => {
        return request(app.getHttpServer())
        .get("/movies/1")
        .expect(200)
  }) // Error
```

<br />

왜냐하면 main.ts에서 pipe 설정을 해주었는데, 이때 설정 값 중에서 transform을 true로 해주었다. 즉, controller에서 변수의 타입을 내가 원하는대로 transform 할 수 있게 바꿔 놓았다. 
url에서의 id는 string이고, 이를 number로 바꾸었는데, 테스트에서도 실제 어플리케이션의 환경을 그대로 적용시켜줘야한다. 지금 서버를 켜서 돌아가는 서버와 테스트 서버는 별개이기 때문이다. 

<br />

main.ts
```main.ts
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,   // 변수의 타입을 원하는 대로 설정 가능하게  
    })
  )
```

위와 같은 설정을 e2e test파일에도 같이 해준다.