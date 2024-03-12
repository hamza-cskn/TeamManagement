using backend.User;

namespace backend.Repositories;

public interface IRepository<T>
{
    void Insert(IEnumerable<T> objs);
    void Insert(T obj);
    void Update(IEnumerable<T> objs);
    void Update(T obj);
    T Load(Identifier id);
    List<T> LoadAll();
    void Delete(T obj);
    bool Exists(Identifier id);
}
