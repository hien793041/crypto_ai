namespace ONE_WEB.Resources
{
    public interface IResourceProvider
    {
        object GetResource(string name, string culture);
    }
}
