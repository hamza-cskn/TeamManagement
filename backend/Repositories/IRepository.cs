namespace backend.Repositories;

public interface IRepository<T>
{
    void Insert(IEnumerable<T> objs);
    void Insert(T comments);
    void Update(IEnumerable<T> objs);
    void Update(T obj);
    T? Load(Guid id);
    List<T> LoadAll();
    void Delete(Guid id);
    bool Exists(Guid id);
}
