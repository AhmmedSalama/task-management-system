import Link from 'next/link';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
        {project.name || project.title}
      </h3>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
        {project.description}
      </p>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {project.members?.length || 1} Members
        </span>
        
        <Link 
          href={`/dashboard/projects/${project._id}`} 
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Board &rarr;
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;