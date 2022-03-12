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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //getAll Testing
  describe("getAll", () => {
    it("should retrun an Array", () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    })
  });

  //getOne Testing
  describe("getOne", () => {
    
    it("should return a movie", () => {
      
      //지금 db에 아무것도 없으니 일단 하나 넣고 시작
      service.create({
        title: "Test",
        genres: ["test"],
        year: 2000
      });

      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });

    it("should throw 404 error", () => {
      try{
        service.getOne(999);
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual("Movie with ID 999 not found.")
      }
    })
  });


  //delete Testing
  describe("delete", () => {
    it("deletes a movie", () => {
      //지금 db에 아무것도 없으니 일단 하나 넣고 시작
      service.create({
        title: "Test",
        genres: ["test"],
        year: 2000
      });
      
      //지우기전 모든 영화 리스트
      const beforeMovie = service.getAll();
      
      //id = 1인 영화 지우기
      service.deleteOne(1);

      //지우고 난 후 모든 영화 리스트
      const afterMovie = service.getAll();

      //toBeLessThan은 길이가 보다 작냐를 뜻함
      expect(afterMovie.length).toBeLessThan(beforeMovie.length);
      
    });

    it("should return a 404", () => {
      try{
        service.deleteOne(999);
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  //create Testing
  describe("create", () => {

    it("should create a movie", () => {

      const beforeCreate = service.getAll().length;
      service.create({
        title: "Test",
        genres: ["test"],
        year: 2000
      });

      const afterCreate = service.getAll().length;

      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });

  });

  //update Testing
  describe("update", () => {

    it("should update a movie", () => {
      service.create({
        title: "Test",
        genres: ["test"],
        year: 2000
      });
      service.update(1, {title: "Update Test"});
      const movie = service.getOne(1);
      expect(movie.title).toEqual("Update Test");
    });

    it("should return a 404", () => {
      try{
        service.update(999, {});
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
    
  });
});
